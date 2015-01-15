'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Offender = mongoose.model('Offender'),
	_ = require('lodash');

	var Authorize = require('auth-net-types'),
	   _AuthorizeCIM = require('auth-net-cim'),
	  	AuthorizeCIM = new _AuthorizeCIM({
	    // api: '78HDftF7Gs',
	    // key: '83H8U65tX3ekuFrD', //Chads TEst API
	    api: '5hB56Vus',
	    key: '37HmG92v4J2yDsMp', //Budget Actual API
	    sandbox: false //true // false
	  });

//Delete Card Info
var delCardInfo = function(off){
	console.log('Deleting', off);
    off.cardNumber = 'XXXXXXXX'+off.last4;
    off.cardExp = '';
    off.cardCVV = '';
    off.save();
    console.log('Done.');
    console.log(off);

};

exports.deletePaymentProfile = function(req, res){

// customerProfileId: req.offender.merchantCustomerId,
// 						  customerPaymentProfileId: req.offender.paymentProfileId,

	//Delete Payment Profile
	AuthorizeCIM.deleteCustomerPaymentProfile({
		customerProfileId: req.offender.merchantCustomerId,
		customerPaymentProfileId: req.offender.paymentProfileId
	}, function(err, response){
		if(err) {
			console.log('Error Deleting Profile', err);
		}else{
			res.status(405).send(err);
		res.status(200).send(response);
	}
	});
	

};


var createPaymentProfile = function(customerId, cus, cardExp, cb){
	console.log('What is cus?', cus);
	console.log('Merchange ID: ', customerId);
	cus.merchantCustomerId = customerId;
	// var cardExp = cus.expYear+'-'+cus.expMonth;
	console.log('Card Expirations: ', cardExp);
var options = {
  customerType: 'individual',
  billTo: {
  		firstName: cus.firstName,
  		lastName: cus.lastName,
  		address: cus.billingAddress,
  		city: cus.billingCity,
  		state: cus.billingState,
  		zip: cus.billingZipcode,
  		phoneNumber: cus.mainPhone
  },
  payment: {
    creditCard: new Authorize.CreditCard({
      cardNumber: cus.cardNumber,
      expirationDate: cardExp,
      cardCode: cus.cardCVV
    })
  }
}

AuthorizeCIM.createCustomerPaymentProfile({
  customerProfileId: customerId,
  paymentProfile: options
}, function(err, response) {
	if(err) {
		console.log('Error Line 62 - OffenderServer Controller', err);
		cb(err, null);
	}else{
		console.log('Response from Payment Profile, ', response);
		cus.cardNumber = 'XXXXXXXX'+cus.last4;;
		cus.cardExp = '';
		cus.cardCVV = '';
		console.log('Here is payment infO: ', response.customerPaymentProfileId);
		cus.paymentProfileId = response.customerPaymentProfileId;
		console.log('???', cus.paymentProfileId );
		cus.save(function(err) {
			if(err) console.log('Error Saving Customer', err);
			console.log('Customer: ', cus);
			// cb(null, 'Payment Profile ID: '+response.customerPaymentProfileId);
				AuthorizeCIM.validateCustomerPaymentProfile({
						  customerProfileId: cus.merchantCustomerId,
						  customerPaymentProfileId: cus.paymentProfileId ,
						  validationMode: 'liveMode' // liveMode
						}, function(err, response) {
							if(err){
							console.log('ERROR Validating Card', err);
							// res.status(409).send('Error: '+err);
							cb(err,null);
						}else{
							console.log('Card Validated ', response);
							// res.status(200).send('Card Information Updated & Validated');
							cb(null, response);
						}
				});


	});

	}

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
		if(err) {


			console.log('ERROR from Auth.net!', err);
			cb(err, null);

		}else {
			console.log('Response from Auth.net', response);
			
				console.log('Customer Profile ID: ', response.customerProfileId);
				off.merchantCustomerId = response.customerProfileId;
				
				if(off.cardNumber && off.cardNumber.length>3){
					createPaymentProfile(response.customerProfileId, off, function(err, data){
					if(err){
						console.log('Error Line 118', err);
						off.save(function(err) {
						if(err) console.log('Error Saving Customer', err);
						});
						cb(err, null);
					}else {
					console.log('Line 120 - response From createPaymentProfile', data);

						cb(null, data);
					}
				});

				}else{
					off.save(function(err) {
						if(err) {
							console.log('Error Saving Customer', err);
							cb(err, null);
						}else{
							console.log('Saving customer without creating payment profile');
							cb(null, {'paymentProfile': response.customerProfileId});
						}

						});

				}

			
		}
		
	


	});





};



//Update Credit Card Info
exports.updateCCInfo = function (req, res) {
	console.log('Updating the CC Info');
	// console.log(req.offender);
	console.log('Credit Info: ', req.body);
	 // var customerID2 = req.offender._id.toString();
	  // var customerID = customerID2.substring(3, 23);
	  // var cardExp = req.offender.expYear+'='+req.offender.expMonth;
	  // console.log('Customer ID: ', customerID);

	  //If customer already has Merchant ID and Payment Profile ID 
	  //Update or Delete or Create New 

	  if(req.offender.paymentProfileId && req.offender.merchantCustomerId){
	  	//Customer already has at least one card on File - Check to see which one we are updating
	  	var paymentProfileId = req.body.updateProfile;
	  	console.log('We are supposed to update: ', paymentProfileId);
	  	console.log('Line 215 Offender: ', req.offender);
	  		  var options = {
				  customerType: 'individual',
				   customerPaymentProfileId: req.offender.paymentProfileId,
				  payment: {
				    creditCard: new Authorize.CreditCard({
				      cardNumber: req.body.cardNumber,
				        expirationDate: req.body.expDate,
				        cardCode: req.body.CVV
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
							res.status(409).send('Error: Line 250'+err);
						}else{
							console.log('Card Validated ', response);
							res.status(200).send('Card Information Updated & Validated');
						}
				});

					}
	});
	  }else {
	  	//If customer doesnt have Payment Profile ID and Merchant ID
	  	//Check if it has the Merchant ID
	  	if(req.offender.merchantCustomerId){
	  		//Customer has Merchant ID
	  		console.log('Line 264 -- Has merchant ID but no profile ID', req.offender.merchantCustomerId);
	  		console.log('Offender: ', req.offender);
	  		console.log('Card Exp: ', req.body.expDate);
	  		req.offender.cardNumber = req.body.cardNumber;
	  		req.offender.cardCVV = req.body.cardCVV;
	  		console.log('271::::::: ', req.offender);
	  		createPaymentProfile(req.offender.merchantCustomerId, req.offender, req.body.expDate, function(err, data){
					if(err){
						console.log('Error Line 118', err);
						req.offender.save(function(err) {
						if(err) console.log('Error Saving Customer', err);
						});
						res.status(409).send('Error Line 272: '+err);
					}else {
					console.log('Line 120 - response From createPaymentProfile', data);

						res.status(409).send('Error: Line 276'+err);
					}
				});
	  }else{
	  	//Customer doesnot have Any Profile Create customer Profile 
	  	console.log('Line 281 -- Got No Credit Card Info on this guy...Offender: ', req.offender);
	  	var authNetResult;
	  	createAuthProfile(req.offender, function(err, data){
					if(err){
						console.log('Error creatingAuthProfile', err);
						// res.jsonp({ 'authNet': 'Error', 'authNetErr': err});
						res.status(200).send('Line 287 -- Card Information Updated & Validated');
					}else{
						console.log('Tried to do Auth.net stuff', data);
						if(data.paymentProfile){
							console.log('We only did payment profile');
							authNetResult = 'ProfileOnly';
							res.status(200).send('Line 293 Card Information Updated & Validated');
						}else{
							authNetResult = 'Success';
							res.jsonp({'authNet': authNetResult, 'authNetData': data});
							res.status(200).send('Line 297  == Card Information Updated & Validated');

	  }
	  }
	
	});
	  }
	}

};


/**
 * Create a Offender
 */
exports.create = function(req, res) {
	// console.log('Reqeust Body', req.body);
	var offender = new Offender(req.body);
	offender.user = req.user;
	console.log('Offender Info: ', offender);
	offender.displayName = offender.firstName+' '+offender.lastName;
	offender.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
				// var authNetResult;
				// createAuthProfile(offender, function(err, data){
				// 	if(err){
				// 		console.log('Error creatingAuthProfile', err);
				// 		res.jsonp({'offender': offender, 'authNet': 'Error', 'authNetErr': err});
				// 	}else{
				// 		console.log('Tried to do Auth.net stuff', data);
				// 		if(data.paymentProfile){
				// 			console.log('We only did payment profile');
				// 			authNetResult = 'ProfileOnly';
				// 		}else{
				// 			authNetResult = 'Success';
				// 		}
						// res.jsonp({'offender': offender, 'authNet': authNetResult, 'authNetData': data});
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
	var offender = req.offender;
	// if(offender.cardNumber && offender.cardNumber > 11){
	// offender.cardNumber = 'XXXXXXXX'+offender.last4;
	// offender.cardExp = '';
	// offender.cardCVV = '';
	// }
	

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
exports.list = function(req, res) { Offender.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, offenders) {
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

exports.offenderByDl = function(req, res) { 
		console.log('Looking for by DL Number:', req.body.dl);
		Offender.find().where({driverNumber: req.body.dl}).populate('user', 'displayName').exec(function(err, offender) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		}

		if (! offender) return 'Failed to load Offender by Driver License Number ' + req.body.dl;
		
		
		console.log(offender);
		console.log('Offender Length: ', offender.length)
		if(offender.length > -1){
			console.log('Looks like an actual offender');
			res.jsonp(offender);
		}else{
			res.status(303).send('Sorry no offender to be found');
		}
		
	
		// console.log(offender);
		// console.log('Offender Length: ', offender.length)
		// if(offender.length > -1){
		// 	console.log('Looks like an actual offender');
		// 	res.status(200).send(offender);
		// }else{
		// 	res.status(303).send('Sorry no offender to be found');
		// }
		
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
	console.log('Has Authorization is not authorizing...308');
	// if (req.offender.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};