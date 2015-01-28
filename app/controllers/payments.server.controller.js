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
	    // api: '78HDftF7Gs',
	    // key: '83H8U65tX3ekuFrD', //Chads TEst API
	    api: '5hB56Vus',
	    key: '37HmG92v4J2yDsMp', //Budget Actual API
	    sandbox: false //true // false
	  }), 
	  mandrill = require('mandrill-api/mandrill');
	  var moment = require('moment');
	  var Offender = mongoose.model('Offender'),
	  offenders = require('../../app/controllers/offenders');
	  var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	  var async = require('async');

	  //Send Receipt for Cash Payment
	  exports.sendReceipt = function(req, res){
	  	console.log('Sending Receipt: ', req.body);
	  	console.log('Payment: ', req.body.payment);
	  	if(req.body.payment && req.body.payment.workorder){

	  	workorderByID(req.body.payment.workorder, function(workorder){
	  			console.log('Return: ', workorder);
	  			
	  			offenderByID(workorder.offender, function(err, offender) {
					if (err) {
						console.log('Got an error finding the offender; ', err);
						return res.status(400).send({
							message: err //errorHandler.getErrorMessage(err)
						});
					} else {
						console.log('Got Offender @ Payment Line 44', offender);
						// console.log('Req.offender??', req.offender);
						generateEmailReceipt(workorder, offender, req.body.payment, function(err, retInfo){
							if(err){
								console.log('ERROR Line 48 - Payment Server: ', err);
								res.status(400).send('eror: ', err);
							}else{
								console.log('Got our return info: ', retInfo);
								res.status(200).send('Receipt Complete: ', retInfo);
							}

						});
					}
				});
	  			

	  		});
	  }
	};

	var generateEmailReceipt = function(workorder, offender, payment, cb){
		console.log('Got to Generate Receipt: ');
		console.log('-----------------------');
		console.log('WORKORDER ==========');
		console.log(workorder);
		console.log('-----------------------');
		console.log('-----------------------');
		console.log('Payment ==========');
		console.log(payment);
		console.log('-----------------------');
		console.log('-----------------------');
		console.log('OFFENDER ==========');
		console.log(offender);
		console.log('-----------------------');
		

		


		
		var timesrun = 0;
		var today = moment().format("MMM DD, YYYY [at] hh:mm a");
		var invoiceNumber = Date.now();

		var message = {	
		'subject': 'Ignition Interlock Receipt',
		'from_email': offender.user.email,
		'from_name': offender.user.displayName,
		'to': [{
			'email': offender.offenderEmail,
			'name': offender.displayName,
				'type': 'to'
		}],
		'headers': {
			'Reply-To': offender.user.email
		},
		'merge': true,
		'global_merge_vars': [
					{
						'name': 'invoiceNumber',
						'content': invoiceNumber || ''
					},
					{
						'name': 'address',
						'content': offender.billingAddress || ''
					},
					{
						'name': 'city',
						'content': offender.billingCity || ''
					},
					{
						'name': 'state',
						'content': offender.billingState || ''
					},
					{
						'name': 'zip',
						'content': offender.billingZipcode  || ''
					},

					
					
					{
						'name': 'workType',
						'content': 'Service'
					},
					{
						'name': 'clientName',
						'content': offender.firstName+' '+offender.lastName  || ''
					},
					{
						'name': 'serviceCenter',
						'content': workorder.serviceCenter  || ''
					},
					{
						'name': 'svcAddress',
						'content': workorder.svcAddress  || ''
					},
					{
						'name': 'pmtOpt',
						'content': payment.pmtOpt || ''
					},
					{
						'name': 'paymentNotes',
						'content': payment.notes  || ''
					},
				

					{
						'name': 'date',
						'content': today
					},

					{
						'name': 'vehicleYear',
						'content': offender.vehicleYear
					},

					{
						'name': 'offenderName',
						'content': offender.firstName+' '+offender.lastName
					},
					{
						'name': 'vehicleMake',
						'content': offender.vehicleMake
					},
					{
						'name': 'vehicleModel',
						'content': offender.vehicleModel
					},
					{
						'name': 'driverNumber',
						'content': offender.driverNumber
					},
					{
						'name': 'workorderid',
						'content': workorder._id
					},
					{
						'name': 'email',
						'content': offender.offenderEmail
					},
					{
						'name': 'orderTotal',
						'content': workorder.amount
					},
				
				
		],
		'important': false,
		'track_opens': null,
		'track_clicks': null,
		'auto_text': null,
		'auto_html': null,
		'inline_css': true,
		'url_strip_qs': null,
		'preserver_recipients': null,
		'view_content_link': null,
		'bcc_address': 'fivecsconsulting@gmail.com',
		'tracking_domain': null,
		'signing_domain': null,
		'return_path_domain': null,
	
	        };

	var template_name='budget-receipt';
		


	var async = false;
	if(timesrun < 2){

	mandrill_client.messages.sendTemplate({
		'template_name': template_name,
		'template_content': [],
		'message': message, 
		'async': async
	}, function(result){
		timesrun++;
		console.log('Results from Mandrill', result);
		// console.log('Result.message', result.message);
		var id = result[0]['_id'];
		console.log('Result[0]', result[0]['_id']);
		console.log('Email ID: ', id);
		cb(null, 'Complete: '+id);
		
			
		
	},
	function(e){
		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
		cb('Error from Mandrill : '+e);


	});

	// res.status(200).send(mypdf);
	}




	  };

	exports.getPaymentProfiles = function(req, res){
		console.log('Getting Payment Profiles');

			AuthorizeCIM.getCustomerProfile(req.body.offender.merchantCustomerId, function(err, response) {
				if(err) {
					console.log('Error getting Profile for ', req.body.offender.merchantCustomerId);
					res.status(300).send('No Paymetn Profiles');
				}else{
					console.log('Profile Response: ', response);
				console.log('Payment Profiles', response.profile.paymentProfiles);
				res.status(200).send(response);
				}

				


			});


	};

		exports.checkPastDue = function(req, res) {
			console.log('Checking Past Due: ', req.body);
			console.log('ID: ', req.body.id);
			var today = moment();
			console.log('Today is: ', today);
			Payment.find({
				dueDate: {
					$lte: today
				},
				status: 'Due',
				offender: req.body.id
			}).sort('-created').populate('user', 'displayName').exec(function(err, payments) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				console.log('We found '+payments.length+' past due payments!!!! ');
				res.jsonp(payments);
			}
		});
	};



	var createMonthlyCharge = function() {
		//GO thru each Offender and create a new Charge for them
		//This should run one time per month...right now every month on the 1st
		//may need to modify library in order to run this code on a specific date for each customer
		//Perhaps every day at 5am we run a function to check each customer's BillDate and then run this functio
		//YES -- DO THAT!!!
		console.log('Creating Monthly Fee');
		// var startDate = moment().hours(0).minutes(0).seconds(0);

		//  var today = new moment();
		//  var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
		//  var tomorrow = moment().add(1, 'days').hours(0).minutes(0).seconds(0);
	 //     var t = tomorrow._d;
	 //     startDate = startDate._d;
	 //     var startDate2 = moment(startDate).format("YYYY-M-DTHH:mm:ss");
	 //     var endDate2= moment(t).format("YYYY-M-DTHH:mm:ss");
	 //     console.log('Tomorrow: ', t);
	 //     console.log('Start Date: ', startDate2);
	 //     console.log('End Date: ', endDate2);




		Offender.find().sort('-created').populate('user', 'displayName').exec(function(err, offenders) {
			if (err) {
				return res.status(400).send({
					message: err //errorHandler.getErrorMessage(err)
				});
			} else {
				// console.log('Offenders List: ', offenders);
				var today = new moment();
  	
				var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
				var nextMonth = moment().add(15, 'days').hours(0).minutes(0).seconds(0);

				async.forEach(offenders, function(item, callback){
					console.log('Client ', item.displayName);
					console.log('Bill Date is: ', item.billDate);
					var d = new Date();
					var n = d.getDate();
					console.log('Todays date is: ', n);
					// n = n-1;


					if(item.billDate == n ){
						console.log('Today is this customers bill date -- need to generate a charge');
							var payment = new Payment({
						    pmtType: 'Monthly Service Fee',
						    dueDate: nextMonth,
						    offender: item._id,
						    status: 'Due',
						    notes: 'Autogenerated Invoice on '+convertedPretty,
						    amount: '75',
							});
								
							payment.save(function(err) {
								if (err) {
									return res.status(400).send({
										message: errorHandler.getErrorMessage(err)
									});
								} else {
								// res.jsonp(payment);
								console.log('Payment for '+item.displayName);
								// callback();

								}
							});
						} else {
							console.log('Not '+item.displayName+'\'s bill date...move on.');
						}

						}, function(err){
								console.log('Finished Making Monthly Fees');
							})
				}
		});
	};


//Mess with Cron Job -- need to schedule things
// -- New Payment Due every 30th day after Install
// -- New appointment every 30th day after Install
// -- New REset Function every 90th day after last deployment

var CronJob = require('cron').CronJob;

//Check who needs to be billed
var job = new CronJob({
  cronTime: '10 01 20 * * 0-6',

  //Every minute at :00 - 7 days per week: '0 */1 * * * 1-7'
  onTick: function() {
  	console.log('Ontick called');
  	var today = new moment();
  	// var startDate = moment().hours(0).minutes(0).seconds(0);
	var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
    console.log('Running Ontick!!', convertedPretty);
    createMonthlyCharge();
  },
  start: false,
  // timeZone: "America/Los_Angeles"
});

// console.log('Job.start about to executie!!');

job.start();


//Charge all customers on AutoPay
var jobCharge = new CronJob({
  // cronTime: '5,25,40 * * * * 0-6',
   cronTime: '10 30 20 * * 0-6',
  //Every minute at :00 - 7 days per week: '0 */1 * * * 1-7'
  onTick: function() {
  	console.log('Ontick called');
  	var today = new moment();
  	// var startDate = moment().hours(0).minutes(0).seconds(0);
	var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
    console.log('Going to charge some cards!!!', convertedPretty);
    autoCharge();
  },
  start: false,
  // timeZone: "America/Los_Angeles"
});

// console.log('Job.start about to executie!!');

jobCharge.start();



var chargeIt = function(pmt, callback){
	console.log('Charging it...');
	console.log('Payment: ', pmt);
	var offender = offenderByID(pmt.offender, function(err, cus){
		if(err){
			console.log('Err finding offender...loine 435');
			return callback(err);
		}
		if(cus && cus.merchantCustomerId && cus.paymentProfileId){
			console.log('Auto Charge this bastard'+cus.displayName+' '+pmt.amount+':::'+pmt._id);
			
				var transaction = {
				  amount: pmt.amount,
				  // tax: {
				  //   amount: 0,
				  //   name: 'State Tax',
				  //   // description: taxState
				  // },
				 
					  customerProfileId: cus.merchantCustomerId,
					  customerPaymentProfileId: cus.paymentProfileId,
				  order: {
				    invoiceNumber: Date.now(),
				    description: 'Auto Payment of Monthly Interlock Fee'
				  },
				  billTo: {
				  	firstName: cus.firstName,
				  	lastName: cus.lastName,
				  	address: cus.billingAddress
				  }
				};

				AuthorizeCIM.createCustomerProfileTransaction('AuthCapture' /* AuthOnly, CaptureOnly, PriorAuthCapture */, transaction, function(err, response) {
					if(err){
						console.log('Error Charging Card', err);
						// res.status(400).send('ERROR: '+err);
						return callback(err);
					}
					if(response){
						console.log('Card has been charged!!', response);
						pmt.status='Paid';
						pmt.paidDate = Date.now();
						pmt.save(function(err, data){
							if(err){
								console.log('Error saving Payment...');
								return callback('Error saving payment...'+err);
							}
							console.log('Payment Saved...', data);
							return callback(null, response);

						});
						
						// res.status(200).send(response);
					}
				});




		}

	})
	

};
var autoCharge = function(){
	console.log('Charging cards now...');
var today = moment().endOf('day');
var tomorrow = moment(today).add(1, 'days');
console.log('Today is: ', today);
console.log('Tomorrow will be : ', tomorrow);

	// Step 1. Get the payments that are due
	// Step 2. Find out if those Offenders have a CC on File
	// Step 3. Charge that Credit Card

		Payment.find({
			dueDate: {
				$lt: today.toDate()
			},
			status: 'Due'
		}).exec(function(err, payments) {
			if (err) {
				console.log('Error !!! :', err);
				return res.status(400).send({
					message: err //errorHandler.getErrorMessage(err)
				});
			} else {
				console.log('Got Payments: ');
				// console.log('Offenders List: ', offenders);
				
  				
				// var convertedPretty = new moment().format("MM/DD/YYYY hh:mm:ss");
	
				// var nextMonth = moment().add(15, 'days').hours(0).minutes(0).seconds(0);

				

				async.forEach(payments, function(item, callback){
					// console.log('Payment: ', item);
					if(!item.paidDate && item.status==='Due'){
						console.log('This bitch needs to be charged...');
						console.log('*************');
						var dueDate = item.dueDate;
						var status = item.status;
						console.log('This will be charged '+item.amount+' because it is '+item.status+' and it was due: '+item.dueDate);
						chargeIt(item, function(err, data){
							console.log('Return from charge it', err);
							console.log('Data: ', data);
						});
						// async.waterfall([
						// 	function(){ callback(item);},
						// 	function(item){
						// 		console.log('Working with '+item+' going to see if the Offender has a card on file');
						// 		Offender.find({userId: item.offender}, function(err, offender){
						// 			if(err){
						// 				console.log('Error; ', err);
						// 				return callback(err);
						// 			}
						// 			callback(offender)
						// 		})
								
						// 	},
						// 	function(arg1, arg2){
								
						// 		console.log('Arg1: ', arg1);
						// 		console.log('Arg2: ', arg2);
						// 		callback('done');
						// 	},
						// 	], function(err, results){
						// 		//results should be done
						// 		if(err){
						// 			console.log('Got an error',err);
						// 			console.trace();


						// 		}else{
						// 			console.log('Results: ', results);
						// 		}
						// 	});
					}
					

					// console.log('Client ', item.displayName);
					// console.log('Bill Date is: ', item.billDate);
					// var d = new Date();
					// var n = d.getDate();
					// console.log('Todays date is: ', n);
					// // n = n-1;


					// if(item.billDate == n ){
					});
			}
		});

	console.log('Done');
};

// var job2 = new CronJob({
//   cronTime: '55 * * * * 0-6',
//   //Every minute at :00 - 7 days per week: '0 */1 * * * 1-7'
//   onTick: function() {
//   	console.log('Time check Motherfuckers!!!!!!!!!!');
//   	var today = new moment();
//   	// var startDate = moment().hours(0).minutes(0).seconds(0);
// 	var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
//     console.log('The current time is...', convertedPretty);
//     createMonthlyCharge();
//   },
//   start: false,
//   // timeZone: "America/Los_Angeles"
// });
// job2.start();

// var job3 = new CronJob({
//   cronTime: '0,30 30 * * * 0-6',
//   //Every minute at :00 - 7 days per week: '0 */1 * * * 1-7'
//   onTick: function() {
//   	console.log('Job 3 Has Been Called...');
//   	var today = new moment();
//   	// var startDate = moment().hours(0).minutes(0).seconds(0);
// 	var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
//     console.log('Running Job3!!', convertedPretty);
//     // createMonthlyCharge();
//   },
//   start: false,
//   // timeZone: "America/Los_Angeles"
// });
// job3.start();

// var job4 = new CronJob({
//   cronTime: '0,30 01 18,19,20 * * 0-6',
//   //Every minute at :00 - 7 days per week: '0 */1 * * * 1-7'
//   onTick: function() {
//   	console.log('Job 4 Has Been Called...');
//   	var today = new moment();
//   	// var startDate = moment().hours(0).minutes(0).seconds(0);
// 	var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
//     console.log('Running Job4!!', convertedPretty);
//     console.log('WOOOOOOOTOOOOTOTOTOOT');
//     // createMonthlyCharge();
//   },
//   start: false,
//   // timeZone: "America/Los_Angeles"
// });
// job4.start();


// var job5 = new CronJob({
//   cronTime: '01 01 21 * * 0-6',
//   //Every minute at :00 - 7 days per week: '0 */1 * * * 1-7'
//   onTick: function() {
//   	console.log('Job 5Has Been Called...');
//   	var today = new moment();
//   	// var startDate = moment().hours(0).minutes(0).seconds(0);
// 	var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
//     console.log('Running Job5 !!', convertedPretty);
//     createMonthlyCharge();
//   },
//   start: false,
//   // timeZone: "America/Los_Angeles"
// });
// job5.start();


// createMonthlyCharge();

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

var offenderByID = function(id, next) { Offender.findById(id).populate('user').exec(function(err, offender) {
		if (err) return next(err);
		if (! offender) return next(new Error('Failed to load Offender ' + id));
		
		// console.log('Got OFfender: ', offender);
		next(null, offender);
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
	var today = moment().hours(20).minutes(0).seconds(0);
	payment.dueDate = today;

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
	console.log('Type of Request: ', req.body.choose);
	if(req.body.choose==='due'){
		Payment.find().where({offender: id, status: 'Due'}).populate('user', 'displayName').exec(function(err, payment) {
		if (err) return err;
		if (! payment) return new Error('Failed to load Payment ' + id);
		// req.workorder = workorder ;
		// console.log('Found Payments: ', payment);
		res.status(200).send(payment);
	});

	}else{

		Payment.find().where({offender: id}).populate('user', 'displayName').exec(function(err, payment) {
		if (err) return err;
		if (! payment) return new Error('Failed to load Payment ' + id);
		// req.workorder = workorder ;
		// console.log('Found Payments: ', payment);
		res.status(200).send(payment);
	});

	}

		
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
exports.list = function(req, res) { Payment.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, payments) {
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