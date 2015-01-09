'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('errors'),
	Payment = mongoose.model('Payment'),

	Workorder = mongoose.model('Workorder'),
	_ = require('lodash');
	var Authorize = require('auth-net-types')
	  , _AuthorizeCIM = require('auth-net-cim')
	  , AuthorizeCIM = new _AuthorizeCIM({
	    api: '78HDftF7Gs',
	    key: '83H8U65tX3ekuFrD',
	    sandbox: true // false
	  });
	  // var q = require('q');
// var Workorder = require('Workorder');
// var workorders = require('../../app/controllers/workorders');


var workorderByID = function(id, cb) { 
	console.log('Looking for WOrk Order', id);

	Workorder.findById(id).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		// req.workorder = workorder ;
		console.log('Got the workorder');
		cb(workorder);
	});
};


var chargeCard = function(req, res){
	console.log('Got here', req);
};

var makePayment = function(req, res, pmt) {
	console.log('Making payment...', pmt);

	//if Payment Opt is credit card -- run Auth.net Integration
	

// 	var workCharge;
// 	if(req.workorder.type==='New Install') {
// 		workCharge = 189;
	
// 	}else{
// 		workCharge = 50;
// 	}
	
// 	var totalCharge = workCharge*1.0985;
// 	totalCharge = totalCharge.toFixed(2);
// 	var invoiceNumber = 6544;
// 	var stateTax = +totalCharge-workCharge;
// 	stateTax = stateTax.toFixed(2);
// 	var taxState = 'KS';

// console.log('Total Charge: ', totalCharge);
// console.log('Work Order Charge: ', workCharge);
// console.log('Tax Amount: ', stateTax);

// 	var transaction = {
//   amount: totalCharge,
//   tax: {
//     amount: stateTax,
//     name: 'State Tax',
//     description: taxState
//   },
//   // shipping: {
  //   amount: 5.00,
  //   name: 'FedEx Ground',
  //   description: 'No Free Shipping Option'
  // },
// 	  customerProfileId: cus.merchantCustomerId,
// 	  customerPaymentProfileId: cus.paymentProfileId,
//   order: {
//     invoiceNumber: Date.now(),
//     description: 'Work at '+req.workorder.serviceCenter
//   },
//   billTo: {
//   	firstName: cus.firstName,
//   	lastName: cus.lastName,
//   	address: cus.billingAddress
//   }
// };

// AuthorizeCIM.createCustomerProfileTransaction('AuthCapture' /* AuthOnly, CaptureOnly, PriorAuthCapture */, transaction, function(err, response) {
// 	if(err){
// 		console.log('Error Charging Card', err);
// 		res.status(400).send('ERROR: '+err);
// 	}
// 	if(response){
// 		console.log('Card has been charged!!', response);
// 		res.status(200).send(response);
// 	}
// });



res.jsonp(pmt);


};
/**
 * Create a Payment
 */
exports.create = function(req, res) {
	var payment = new Payment(req.body);
	payment.user = req.user;

	payment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// res.jsonp(payment);
			makePayment(req, res, payment);
		}
	});
};


//Get Payments associated with a specific offender
exports.getByOffender = function(req, res) { 
	console.log('Get Payment By OFfender: ', req.body);
	
	var id = req.body.id;
	console.log('Offender ID: ', id);

		Payment.find().where({offender: id}).populate('user', 'displayName').exec(function(err, payment) {
		if (err) return err;
		if (! payment) return new Error('Failed to load Payment ' + id);
		// req.workorder = workorder ;
		console.log('Found Payments: ', payment);
		res.status(200).send(payment);
	});
};

/**
 * Show the current Payment
 */
exports.read = function(req, res) {
	res.jsonp(req.payment);
};

/**
 * Update a Payment
 */
exports.update = function(req, res) {
	var payment = req.payment ;

	payment = _.extend(payment , req.body);

	payment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payment);
		}
	});
};

/**
 * Delete an Payment
 */
exports.delete = function(req, res) {
	var payment = req.payment ;

	payment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payment);
		}
	});
};

/**
 * List of Payments
 */
exports.list = function(req, res) { Payment.find().sort('-created').populate('user', 'displayName').exec(function(err, payments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(payments);
		}
	});
};

/**
 * Payment middleware
 */
exports.paymentByID = function(req, res, next, id) { Payment.findById(id).populate('user', 'displayName').exec(function(err, payment) {
		if (err) return next(err);
		if (! payment) return next(new Error('Failed to load Payment ' + id));
		req.payment = payment ;
		next();
	});
};

/**
 * Payment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.payment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};