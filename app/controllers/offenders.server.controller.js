'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Offender = mongoose.model('Offender'),
	_ = require('lodash');

	var Authorize = require('auth-net-types')
	  , _AuthorizeCIM = require('auth-net-cim')
	  , AuthorizeCIM = new _AuthorizeCIM({
	    api: '78HDftF7Gs',
	    key: '83H8U65tX3ekuFrD',
	    sandbox: true // false
	  });

var createPaymentProfile = function(customerId, cus){
	console.log('What is cus?', cus);
	cus.merchantCustomerId = customerId;
	var cardExp = cus.expYear+'-'+cus.expMonth;
	console.log('Card Expirations: ', cardExp);
var options = {
  customerType: 'individual',
  payment: {
    creditCard: new Authorize.CreditCard({
      cardNumber: cus.cardNumber,
      expirationDate: cus.cardExp,
      cardCode: cus.cardCVV
    })
  }
}

AuthorizeCIM.createCustomerPaymentProfile({
  customerProfileId: customerId,
  paymentProfile: options
}, function(err, response) {
	if(err) console.log(err);
	console.log('Response from Payment Profile, ', response);
	cus.cardNumber = '';
	cus.cardExp = '';
	cus.cardCVV = '';
	console.log('Here is payment infO: ', response.customerPaymentProfileId);
	cus.paymentProfileId = response.customerPaymentProfileId;
	console.log('???', cus.paymentProfileId );
	cus.save(function(err) {
		if(err) console.log('Error Saving Customer', err);
		console.log('Customer: ', cus);


	});
});
	
};

//Create Customer Profile on Authorize.net
var createAuthProfile = function(off, cb) {
	console.log('Running Authorization for Auth.net');
	

	  console.log('Do we have Offender: ', off);
	  var customerID2 = off._id.toString();
	  var customerID = customerID2.substring(3, 23);
	  console.log('Customer ID: ', customerID);
	 var profile = {
  merchantCustomerId: customerID,
  description: off.firstName+' '+off.lastName,
  email: off.offenderEmail,
  // customerProfileId: 349494
}



	AuthorizeCIM.createCustomerProfile({customerProfile: profile}, function(err, response){
		if(err) console.log('ERROR from Auth.net!', err);
		console.log('Response from Auth.net', response);
		// console.log('Customer id: ', response.$);
		
		if(response && off.cardNumber.length > 11) {
			console.log('Customer Profile ID: ', response.customerProfileId);
			createPaymentProfile(response.customerProfileId, off);
		}
	});





};

//Update Credit Card Info
exports.updateCCInfo = function (req, res) {
	console.log('Updating the CC Info');
	console.log(req.offender);
	 // var customerID2 = req.offender._id.toString();
	  // var customerID = customerID2.substring(3, 23);
	  // var cardExp = req.offender.expYear+'='+req.offender.expMonth;
	  // console.log('Customer ID: ', customerID);
	  if(req.offender.paymentProfileId && req.offender.merchantCustomerId){
	  		  var options = {
				  customerType: 'individual',
				   customerPaymentProfileId: req.offender.paymentProfileId,
				  payment: {
				    creditCard: new Authorize.CreditCard({
				      cardNumber: req.offender.cardNumber,
				        expirationDate: req.offender.cardExp,
				        cardCode: req.offender.cardCVV
				    })
				  }
				}

				AuthorizeCIM.updateCustomerPaymentProfile({
				  customerProfileId: req.offender.merchantCustomerId,
				  paymentProfile: options
				  
				}, function(err, response) {
					if(err) {
						console.log('Errror updating Customer Payment Profile: ', err);
						res.status(409).send('Error: '+err);
					} 
					if(response) {

						console.log('Response from Update: ', response);
						// res.status(200).send('Card Information Updated');

							
						AuthorizeCIM.validateCustomerPaymentProfile({
						  customerProfileId: req.offender.merchantCustomerId,
						  customerPaymentProfileId: req.offender.paymentProfileId,
						  validationMode: 'testMode' // liveMode
						}, function(err, response) {
							if(err){
							console.log('ERROR Validating Card', err);
							res.status(409).send('Error: '+err);
						}else{
							console.log('Card Validated ', response);
							res.status(200).send('Card Information Updated & Validated');
						}
				});

					}
	});
	  }else {
	  	console.log('This customer seems to have no CC Info Setup');
	  	createAuthProfile(req.offender, function(err, resp){
	  		if(err) {

	  			console.log('Error Addint Customer Auth Profile');
	  			res.status(333).send('Card Information Update ERROR');
	  		}else{
	  			console.log('Response from creating Auth PRofile', resp);
	  			res.status(200).send('Card Information Updated');
	  		}


	  	});

	  }
	



};


/**
 * Create a Offender
 */
exports.create = function(req, res) {
	console.log('Reqeust Body', req.body);
	var offender = new Offender(req.body);
	offender.user = req.user;
	console.log('Offender Info: ', offender);
	offender.displayName = offender.firstName+ ' '+offender.lastName;
	offender.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			createAuthProfile(offender);
			res.jsonp(offender);
		}
	});
};

/**
 * Show the current Offender
 */
exports.read = function(req, res) {
	res.jsonp(req.offender);
};

/**
 * Update a Offender
 */
exports.update = function(req, res) {
	var offender = req.offender ;

	offender = _.extend(offender , req.body);

	offender.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offender);
		}
	});
};

/**
 * Delete an Offender
 */
exports.delete = function(req, res) {
	var offender = req.offender ;

	offender.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offender);
		}
	});
};

/**
 * List of Offenders
 */
exports.list = function(req, res) { Offender.find().sort('-created').populate('user', 'displayName').exec(function(err, offenders) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offenders);
		}
	});
};

exports.pending = function(req, res) { 
	console.log('Getting Pending ORders', req.user);
	if(req.user.shop){
		console.log('This user has an assigned Shop', req.user.shop);
	}else{
		console.log('This user doesnt have an assigned shop');
	}
	var shop = req.user.shop;
	Offender.find().where({assignedShop: req.user.shop}).sort('-created').exec(function(err, offenders) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('Got some offenders!!');
			console.log(offenders.length);
			res.jsonp(offenders);
		}
	});
};

/**
 * Offender middleware
 */
exports.offenderByID = function(req, res, next, id) { Offender.findById(id).populate('user', 'displayName').exec(function(err, offender) {
		if (err) return next(err);
		if (! offender) return next(new Error('Failed to load Offender ' + id));
		req.offender = offender ;
		next();
	});
};

/**
 * Offender authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.offender.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};