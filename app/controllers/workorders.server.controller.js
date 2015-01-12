'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Workorder = mongoose.model('Workorder'),
	_ = require('lodash'),
	Offender = mongoose.model('Offender'),
	mandrill = require('mandrill-api/mandrill');
	var moment = require('moment');


	var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	var Authorize = require('auth-net-types')
	  , _AuthorizeCIM = require('auth-net-cim')
	  , AuthorizeCIM = new _AuthorizeCIM({
	    api: '78HDftF7Gs',
	    key: '83H8U65tX3ekuFrD',
	    sandbox: true // false
	  });

/**
 * Create a Workorder
 */
exports.create = function(req, res) {
	var workorder = new Workorder(req.body);
	workorder.user = req.user;
	console.log('New WOrk Order: ', workorder);
	workorder.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * Show the current Workorder
 */
exports.read = function(req, res) {
	res.jsonp(req.workorder);
};

/**
 * Update a Workorder
 */
exports.update = function(req, res) {
	var workorder = req.workorder ;

	workorder = _.extend(workorder , req.body);

	workorder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * Delete an Workorder
 */
exports.delete = function(req, res) {
	var workorder = req.workorder ;

	workorder.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * List of Workorders
 */
exports.list = function(req, res) { 

	console.log('Listing WOrk Orders Now');


	Workorder.find().sort('-created').populate('user').exec(function(err, workorders) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorders);
		}
	});
};

/**
 * Workorder middleware
 */
exports.workorderByID = function(req, res, next, id) { 
	console.log('Looking for WOrk Order', id);

	Workorder.findById(id).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		req.workorder = workorder ;
		next();
	});
};


exports.getByOffender = function(req, res, id) { 
	console.log('Get By OFfender: ', req.body);


		Workorder.find().where({offender: id}).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		// req.workorder = workorder ;
		
		res.status(200).send(workorder);
	});
};


exports.offenderByID = function(req, res, next, id) { 
	console.log('Trying to get Offender by ID: ', id);
	console.log('Body: ', req.body);
		Workorder.find().where({offender: id}).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		// req.workorder = workorder ;
		res.status(200).send(workorder);
	});
};



/**
 * Workorder authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.workorder.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};


exports.email = function(req, res){

	console.log('Emailing Now');
	// console.log(req.body);
	// console.log(req.query);
	// console.log(req.params);
	// console.log('Did we find Workorder Info, Offender Info, and User info?');
	console.log('WorkOrder: ', req.body.workinfo);
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress,
	timesrun = 0;
	var date = new Date(Date.now());
	var d = date.getDate();
	var m = date.getMonth()+1;
	var y = date.getYear()-100;
	var prepDate = m+'/'+d+'/'+y;
	// //console.log('Quote Date: ',prepDate)
	var termLength = req.body.offender.term;
	var workCharge =req.body.workinfo.amount;
	console.log('Charge for Service: ', workCharge);
	req.body.workinfo.apptDate = req.body.workinfo.apptDate  || '';
	var apptDate = moment(req.body.workinfo.apptDate).format("MM/DD/YYYY");
	var today = moment().format("MMM DD, YYYY");
	// if(req.body.workinfo.type==='New Install') {
	// 	workCharge =  req.body.workinfo.amount || 89;
	
	// }
	// else if(req.body.workinfo.type==='Reset') {
	// 	workCharge = 50;
	
	// }else if(req.body.workinfo.type==='Removal') {
	// 	workCharge = 75;
	
	// }

	//var name = req.query.name;
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'Work_Auth.pdf';
	// doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	//FILL OUT LD LOA
	// doc.image('sigcert.png', 255, 660);  
	//doc.image('LOCALLOA.png', 0, 0,{width: 600});
	// var bg2 = doc.image('LDLOA.png', 0, 0,{width: 600});
	//doc.image('FCTicket.jpg', 0, 0, 600, 800);

		if(req.body.workinfo.type==='New Install'){
			//Generate New Install Agreement
			doc.image('images/cusAgreementPg1.png', 2, 2,{width: 610});
		
		//Place Term Length on contract
		doc.y = 217;
		doc.x = 320;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(termLength,{
			// align: 'center'
		});

		doc.addPage();

		//Page 2 
		doc.image('images/cusAgreementPg2.png', 0, 0,{width: 600});


		//Place Vehicle Info
		doc.y = 298;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
	
			align: 'center'
		});

		//Place Service Center Address
		doc.y = 347;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.workinfo.svcAddress,{
	
			align: 'center'
		});


		doc.addPage();

		//Page 3
		doc.image('images/cusAgreementPg3.png', 0, 0,{width: 600});
		//Device Serial Number
		doc.y = 460;
		doc.x = 355;
		doc.fontSize(14);
		doc.text(req.body.workinfo.deviceSN || 'TBD');


		doc.addPage();

		//Page 4
		doc.image('images/cusAgreementPg4.png', 0, 0,{width: 600});
		
		//Place Service Center Address
		doc.y = 47;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.displayName,{
	
			// align: 'center'
		});
		} else {
			//generate Generic Work ORder


		doc.image('budgetlogo.png', 2, 2,{width: 610});
		
		doc.y = 135;
		doc.x = 70;
		doc.fontSize(30);
		doc.font('Times-Roman');
		doc.fillColor('#1b3959');
		doc.text(req.body.workinfo.type+' Authorization Request',{
			align: 'center'
		});

		doc.y = 270;
		doc.fontSize(17)
		doc.fillColor('black');
		doc.text('Vehicle Info: '+req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
			align: 'center'
		});



		doc.y = 190;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Date: '+prepDate,{
			width: 200,
			align: 'left'
		});

		doc.y = 190;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Service Center: '+req.body.workinfo.serviceCenter,{
			width: 250,
			align: 'left'
		});


		doc.y = 225;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Customer: '+req.body.offender.firstName+' '+req.body.offender.lastName,{
			width: 200,
			align: 'left'
		});

		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Telephone: '+req.body.offender.mainPhone,{
			width: 200,
			align: 'left'
		});



		doc.y = 225;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Driver License #: '+req.body.offender.driverNumber,{
			width: 250,
			align: 'left'
		});

		

		doc.y = 310;
		doc.x = 40;
		doc.fontSize(14)
		doc.fillColor('black');
		doc.text('This form is your invoice, proving that you have approval to have the work completed. This authorization is only good for '+req.body.offender.firstName+' '+req.body.offender.lastName+' at '+req.body.workinfo.serviceCenter+'. Your account will be billed $'+req.body.workinfo.amount+'.00 plus tax for this service.',
			{
				align: 'center',
				width: 500
			});




		doc.y = 662;
		doc.x = 105;
		doc.fontSize(12);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('Customer Printed Name');


		doc.moveTo(100, 660)
		.lineTo(260, 660)
		.stroke();



		doc.y = 622;
		doc.x = 105;
		doc.fontSize(12);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('Customer Signature');


		doc.moveTo(100, 620)
		.lineTo(260, 620)
		.stroke();



		doc.y = 685;
		doc.x = 40;
		doc.fontSize(10)
		doc.fillColor('black');
		doc.font('Times-Roman');
		doc.text('By signing this document, I, '+req.body.offender.firstName+' '+req.body.offender.lastName+', agree to waive all liabilities to Budget Ignition Interlock. I agree that I am trusting my vehicle, and therefor ultimately my life, with '+req.body.workinfo.serviceCenter+'. I also consent to being electronically billed $'+workCharge+'.00 plus tax for this service.',
			{
				align: 'center',
				width: 500
			});
		


	}






doc.on('data', function(chunk){
	chunks.push(chunk);
	
});
 

doc.end();

doc.on('end', function(){
	////console.log(callback);
	////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

			var message = {
	'html': '<p>Work Authorization</p>',
	
	'subject': req.body.workinfo.subject,
	'from_email': req.body.user.email,
	'from_name': req.body.user.displayName,
	'to': [{
		'email': req.body.workinfo.email,
		'name': req.body.workinfo.toWhomName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': req.body.user.email
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.body.workinfo.email,
			'vars': [{
					'name': 'serviceCenter',
					'content': req.body.workinfo.serviceCenter
				},
				{
					'name': 'fName',
					'content': req.body.offender.firstName
				},
				{
					'name': 'repname',
					'content': req.body.user.displayName
				},
				{
					'name': 'repemail',
					'content': req.body.user.email
				},
				{
					'name': 'repphone',
					'content': req.body.user.telephone
				},
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'workOrderId',
					'content': req.body.workinfo.id
				},
				{
					'name': 'workType',
					'content': req.body.workinfo.type
				},
				{
					'name': 'toName',
					'content': req.body.workinfo.toWhomName
				},
				{
					'name': 'serviceCenter',
					'content': req.body.workinfo.serviceCenter
				},
				{
					'name': 'svcAddress',
					'content': req.body.workinfo.svcAddress
				},
				{
					'name': 'customContent',
					'content': req.body.workinfo.content || ''
				},

				{
					'name': 'date',
					'content': today
				},

				{
					'name': 'vehicleYear',
					'content': req.body.offender.vehicleYear
				},

				{
					'name': 'offenderName',
					'content': req.body.offender.firstName+' '+req.body.offender.lastName
				},
				{
					'name': 'vehicleMake',
					'content': req.body.offender.vehicleMake
				},
				{
					'name': 'vehicleModel',
					'content': req.body.offender.vehicleModel
				},
				{
					'name': 'driverNumber',
					'content': req.body.offender.driverNumber
				},
				{
					'name': 'workorderid',
					'content': req.body.workinfo._id
				},
				{
					'name': 'apptDate',
					'content': apptDate
				}





				]
	}],
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
'attachments': [{
		'type': 'application/pdf; name=Buget_IID_WorkOrder.pdf',
		'name': 'BudgetWorkOrder.pdf',
		'content': content
	}]
	
};

var template_name;

if(req.body.workinfo.type==='New Install') {
		template_name='carefree-newclient';
	
	}
	else{
		template_name='carefree-iid-workauth';
	}



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
	res.status(200).send(mypdf);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});

// res.status(200).send(mypdf);
}



});

return;
};

//Create Payment Profile 

var createPaymentProfile = function(customerId, cus, next){
	console.log('Creating Payment Profile.....What is cus?', cus);
	console.log('Customer ID: ', customerId);
	cus.merchantCustomerId = customerId;
	var cardExp = cus.expYear+'-'+cus.expMonth;
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
		console.log('ERROR:::', err);
		return next(err);
	} else {
		console.log('Response from Payment Profile, ', response);


		var id = cus._id;

		Offender.findById(id).populate('user', 'displayName').exec(function(err, offender) {
		if (err) console.log('Error; ', err);
		
		if (! offender) return 'Failed to load Offender ' + id;
		
		if(offender){
			cus = offender ;
			cus.cardNumber = 'XXXXXXXX'+cus.last4;;
			cus.cardExp = '';
			cus.cardCVV = '';
			// console.log('Here is payment infO: ', response.customerPaymentProfileId);
			cus.paymentProfileId = response.customerPaymentProfileId;
			// console.log('???', cus.paymentProfileId );
			// console.log('Cus before Save: ', cus);
			cus.save(function(err) {
				if(err) console.log('Error Saving Customer', err);
					console.log('Customer after Save: ', cus);
					next();
			});
		}
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
		if(err) console.log('ERROR from Auth.net!', err);
		console.log('Response from Auth.net', response);
		// console.log('Customer id: ', response.$);
		
		if(response && off.cardNumber.length > 11) {
			console.log('Customer Profile ID: ', response.customerProfileId);
			// createPaymentProfile(response.customerProfileId, off);
			createPaymentProfile(response.customerProfileId, off, function(err, data){
						if(err){
					console.log('Error from Create Payment Profile: ');
					res.status(402).send(data.message);
				}

				else{
					
						res.status(200).send('Credit Card Valid');
				}
				
			});
		}
	});





};



var updateCCInfo = function(req, res){
	console.log('Updating the CC Info');
	console.log(req.offender);
	console.log('Credit Info: ', req.body);
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
	  			delCardInfo(req.offender);
	  		}


	  	});

	  }



};



var testCharge = function(cardNumber, ExpDate, CVV){
	console.log('Test Credit Card Charge: ');
	var creditCard = {
  cardNumber: cardNumber,
  expirationDate: ExpDate,
  cardCode: CVV
}


var payment = new Authorize.PaymentSimple({
  creditCard: new Authorize.CreditCard(creditCard),
  // bankAccount: new Types.BankAccount(bankAccount)
},
function(err, response) {
							if(err){

								console.log('Error... :( ', err);
							}

							console.log('Response Baby: ', response);
							});
	console.log('Done with testCharge');


};

exports.chargeCCard = function(req, res) {
	console.log('Charging Card via Auth.net', req.body);
	if(req.body.setupProfile){
		console.log('Need to Setup the Payment Profile first');

		console.log('This customer seems to have no CC Info Setup', req.body.offender);
			req.body.offender.cardNumber = req.body.cardNum;
      		req.body.offender.expYear = req.body.expYear;
      		req.body.offender.expMonth = req.body.expMonth;
      		var expDate = req.body.expYear+'-'+req.body.expMonth;
      		testCharge(req.body.cardNum, expDate, req.body.ccv);
      		req.body.offender.cardCVV = req.body.ccv;

		if(req.body.offender.merchantCustomerId){
			console.log('Already setup with Authorize.net - creating new Payment Profile now');
			
			createPaymentProfile(req.body.offender.merchantCustomerId, req.body.offender, function(err, data){
				if(err){
					console.log('Error from Create Payment Profile: ');
					res.status(402).send(err.message);
				}else{
						console.log('No Errors...charging card now');
							var workCharge = req.body.pmt.amount || 0;
							var totalCharge = 0;

							if(workCharge > 0){

							 totalCharge = workCharge*1.0985;
							totalCharge = totalCharge.toFixed(2);
							var invoiceNumber = 6544;
							var stateTax = +totalCharge-workCharge;
							stateTax = stateTax.toFixed(2);
							var taxState = 'KS';

						console.log('Total Charge: ', totalCharge);
						console.log('Work Order Charge: ', workCharge);
						console.log('Tax Amount: ', stateTax);

							var transaction = {
						  amount: totalCharge,
						  tax: {
						    amount: stateTax,
						    name: 'State Tax',
						    description: taxState
						  },
						  // shipping: {
						  //   amount: 5.00,
						  //   name: 'FedEx Ground',
						  //   description: 'No Free Shipping Option'
						  // },
							  customerProfileId: req.body.offender.merchantCustomerId,
							  customerPaymentProfileId: req.body.offender.paymentProfileId,
						  order: {
						    invoiceNumber: Date.now(),
						    description: 'Payment made from portal...'
						  },
						  billTo: {
						  	firstName: req.body.offender.firstName,
						  	lastName: req.body.offender.lastName,
						  	address: req.body.offender.billingAddress
						  }
						};

							AuthorizeCIM.createCustomerProfileTransaction('AuthCapture' /* AuthOnly, CaptureOnly, PriorAuthCapture */, transaction, function(err, response) {
							if(err){
								console.log('Error Charging Card', err);
								res.status(400).send('ERROR: '+err);
							}
							if(response){
								console.log('Card has been charged!!', response);



								res.status(200).send(response);
							}
						});

						} else {
							res.status(200).send('Work Order Authorization has been approved by customer...');
						}
					
				}
			});
		}else{
			console.log('Creating a New Auth.net profile');
		
	  		createAuthProfile(req.body.offender, function(err, resp){

	  		if(err) {

	  			console.log('Error Addint Customer Auth Profile');
	  			res.status(333).send('Card Information Update ERROR');
	  		}else{
	  			console.log('Response from creating Auth PRofile', resp);
	  			res.status(200).send('Card Information Updated');
	  			
	  		}


	  	});
		// updateCCInfo(req, res);



	}
}

};


exports.runAuth = function(req, res) {
	console.log('Running Authorization for Auth.net', req.body);
	if(req.body.setupProfile){
		console.log('Need to Setup the Payment Profile first');
		updateCCInfo(req, res);



	}


	console.log('Workorder?', req.workorder);
	var cus = req.body.offender;
	// if(cus.merchantCustomerId && cus.merchantCustomerId){
	// 		AuthorizeCIM.validateCustomerPaymentProfile({
	//   customerProfileId: cus.merchantCustomerId,
	//   customerPaymentProfileId: cus.paymentProfileId,
	//   validationMode: 'testMode' // liveMode
	// }, function(err, response) {
	// 	if(err){
	// 		console.log('EROR Validating Card', err);
	// 		res.status(300).send('Error Validating Card: '+err);
	// 	}else{
	// 		console.log('REsponse to Validating Cstomer payment profile', response);
	// 		res.status(200).send('WE done charged that card'+response);
	// 	}	
	// });


	// }else{
	// 	console.log('Failed at runnig charge');
	// 	res.status(333).send('WE cannot charge that card'+err);
	// }
	var workCharge = req.workorder.amount;
	
	var totalCharge = 0;
	if(workCharge > 0){

	 totalCharge = workCharge*1.0985;
	totalCharge = totalCharge.toFixed(2);
	var invoiceNumber = 6544;
	var stateTax = +totalCharge-workCharge;
	stateTax = stateTax.toFixed(2);
	var taxState = 'KS';

console.log('Total Charge: ', totalCharge);
console.log('Work Order Charge: ', workCharge);
console.log('Tax Amount: ', stateTax);

	var transaction = {
  amount: totalCharge,
  tax: {
    amount: stateTax,
    name: 'State Tax',
    description: taxState
  },
  // shipping: {
  //   amount: 5.00,
  //   name: 'FedEx Ground',
  //   description: 'No Free Shipping Option'
  // },
	  customerProfileId: cus.merchantCustomerId,
	  customerPaymentProfileId: cus.paymentProfileId,
  order: {
    invoiceNumber: Date.now(),
    description: 'Work at '+req.workorder.serviceCenter
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
		res.status(400).send('ERROR: '+err);
	}
	if(response){
		console.log('Card has been charged!!', response);
		res.status(200).send(response);
	}
});

} else {
	res.status(200).send('Work Order Authorization has been approved by customer...payment is pending');
}







console.log('Done w/ that shit...');


};

//Send Signed Authorization Form

exports.signAuth = function(req, res){

	console.log('Sending Sign Auth Now');
	console.log(req.body);
	// console.log(req.query);
	console.log(req.params);
	console.log('Did we find Workorder Info, Offender Info, and User info?');
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress,
	timesrun = 0;

	// var workCharge;
	// if(req.workorder.type==='New Install') {
	// 	workCharge = 189;
	
	// }
	// else if(req.workorder.type==='Reset') {
	// 	workCharge = 50;
	
	// }else if(req.workorder.type==='Removal') {
	// 	workCharge = 75;
	
	// }
	var workCharge;
	if(req.body.workinfo.type==='New Install') {
		workCharge =  req.body.workinfo.amount || 89;
	
	}
	else if(req.body.workinfo.type==='Reset') {
		workCharge = 50;
	
	}else if(req.body.workinfo.type==='Removal') {
		workCharge = 75;
	
	}





	var timesrun = 0;
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var date = new Date(Date.now());
	var d = date.getDate();
	var m = date.getMonth()+1;
	var y = date.getYear()-100;
	var prepDate = m+'/'+d+'/'+y;
	// //console.log('Quote Date: ',prepDate)

	//var name = req.query.name;
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];


		var myfileName = 'Signed_Work_Auth'+req.body.workinfo._id+'.pdf';
		if(req.body.workinfo.type==='New Install'){
			myfileName = 'cusAgreement'+req.body.workinfo._id+'.pdf';
		}
	doc.pipe( fs.createWriteStream(myfileName) );
	 
	var today = new moment();
	var convertedPretty = moment(today).format("MM/DD/YYYY");
	var termLength = req.body.offender.term;
	
	var firstInitial = req.body.offender.firstName.substring(0, 1);
	var secondInitial = req.body.offender.lastName.substring(0, 1);
	var initials = firstInitial+secondInitial;


	var chunks = [];
	//FILL OUT LD LOA
	// doc.image('sigcert.png', 255, 660);  
	//doc.image('LOCALLOA.png', 0, 0,{width: 600});
	// var bg2 = doc.image('LDLOA.png', 0, 0,{width: 600});
	//doc.image('FCTicket.jpg', 0, 0, 600, 800);

	if(req.body.workinfo.type==='New Install'){
			//Generate New Install Agreement

			console.log('New INstall');
			doc.image('images/cusAgreementPg1.png', 2, 2,{width: 610});
		
		//Place Term Length on contract
		doc.y = 217;
		doc.x = 320;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(termLength,{
			// align: 'center'
		});

		doc.addPage();

		//Page 2 
		doc.image('images/cusAgreementPg2.png', 0, 0,{width: 600});


		//Place Vehicle Info
		doc.y = 298;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
	
			align: 'center'
		});

		//Place Service Center Address
		doc.y = 347;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.workinfo.svcAddress,{
	
			align: 'center'
		});


		doc.addPage();

		//Page 3
		doc.image('images/cusAgreementPg3.png', 0, 0,{width: 600});

		//Device Serial Number
		doc.y = 460;
		doc.x = 355;
		doc.fontSize(14);
		doc.text(req.body.workinfo.deviceSN || 'TBD');


		doc.y = 619;
		doc.x = 385;
		doc.fontSize(14);
		doc.text(convertedPretty);

		doc.y = 525;
		doc.x = 375;
		doc.fontSize(26);
		doc.font('SANTO.TTF');
		doc.text(req.body.offender.displayName);

		doc.y = 577;
		doc.x = 375;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.body.offender.displayName);



		doc.addPage();

		//Page 4
		doc.image('images/cusAgreementPg4.png', 0, 0,{width: 600});
		
		//Place Customer Name
		doc.y = 47;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.displayName,{
	
			// align: 'center'
		});

		//Set Initials
		
		doc.y = 105;
		doc.x = 125;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(initials,{
	
			// align: 'center'
		});

		doc.y = 162;
		doc.x = 125;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(initials,{
	
			// align: 'center'
		});

		doc.y = 220;
		doc.x = 125;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(initials,{
	
			// align: 'center'
		});

		doc.y = 273;
		doc.x = 125;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(initials,{
	
			// align: 'center'
		});

		//Set Signature
		doc.y = 552;
		doc.x = 30;
		doc.fontSize(32);
		doc.font('SANTO.TTF');
		doc.text(req.body.offender.displayName);

		doc.y = 564;
		doc.x = 365;
		doc.fontSize(18);
		doc.font('Times-Roman');
		doc.text(convertedPretty);




		} else {
			//generate Generic Work ORder



		doc.image('budgetlogo.png', 2, 2,{width: 610});
		
		doc.y = 135;
		doc.x = 70;
		doc.fontSize(30);
		doc.font('Times-Roman');
		doc.fillColor('#1b3959')
		doc.text(req.body.workinfo.type+' Authorization Request',{
			align: 'center'
		});

		doc.y = 270;
		doc.fontSize(17)
		doc.fillColor('black');
		doc.text('Vehicle Info: '+req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
			align: 'center'
		});



		doc.y = 190;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Date: '+prepDate,{
			width: 200,
			align: 'left'
		});

		doc.y = 190;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Service Center: '+req.body.workinfo.serviceCenter,{
			width: 250,
			align: 'left'
		});


		doc.y = 225;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Customer: '+req.body.offender.firstName+' '+req.body.offender.lastName,{
			width: 200,
			align: 'left'
		});

		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Telephone: '+req.body.offender.mainPhone,{
			width: 200,
			align: 'left'
		});



		doc.y = 225;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Driver License #: '+req.body.offender.driverNumber,{
			width: 250,
			align: 'left'
		});

		

		doc.y = 310;
		doc.x = 40;
		doc.fontSize(14)
		doc.fillColor('black');
		doc.text('This form is your invoice, proving that you have approval to have the work completed. This authorization is only good for '+req.body.offender.firstName+' '+req.body.offender.lastName+' at '+req.body.workinfo.serviceCenter+'. Your account will be billed $'+req.body.workinfo.amount+'.00 plus tax for this service.',
			{
				align: 'center',
				width: 500
			});



		doc.y = 662;
		doc.x = 105;
		doc.fontSize(12);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('Customer Printed Name');


		doc.moveTo(100, 660)
		.lineTo(260, 660)
		.stroke();

		//Set Customer Printed Name
		doc.y = 648;
		doc.x = 120;
		doc.fontSize(13);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(req.body.offender.firstName+' '+req.body.offender.lastName);



		doc.y = 622;
		doc.x = 105;
		doc.fontSize(12);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('Customer Signature');


		doc.moveTo(100, 620)
		.lineTo(260, 620)
		.stroke();

		//Set Signature
		doc.y = 600;
		doc.x = 120;
		doc.fontSize(24);
		doc.font('SANTO.TTF');
		doc.fillColor('black');
		doc.text(req.body.offender.firstName+' '+req.body.offender.lastName);



		doc.y = 685;
		doc.x = 40;
		doc.fontSize(10)
		doc.fillColor('black');
		doc.font('Times-Roman');
		doc.text('By signing this document, I, '+req.body.offender.firstName+' '+req.body.offender.lastName+', agree to waive all liabilities to Budget Ignition Interlock. I agree that I am trusting my vehicle, and therefor ultimately my life, with '+req.body.workinfo.serviceCenter+'. I also consent to being electronically billed $'+workCharge+'.00 plus tax for this service.',
			{
				align: 'center',
				width: 500
			});
		

	}







doc.on('data', function(chunk){
	chunks.push(chunk);
	
});
 

doc.end();

doc.on('end', function(){
	////console.log(callback);
	////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

			var message = {
	'html': '<p>Approval Copy for </p>',
	
	'subject': 'For Your Records -- Budget IID Approval for '+req.body.workinfo.type,
	'from_email': 'admin@budgetiid.com',
	'from_name': req.body.offender.user.displayName,
	'to': [{
		'email': req.body.offender.offenderEmail,
		'name': req.body.offender.displayName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'admin@budgetiid.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.body.offender.offenderEmail,
			'vars': [{
					'name': 'serviceCenter',
					'content': req.body.workinfo.serviceCenter
				},
				{
					'name': 'repname',
					'content': req.body.offender.user.displayName
				},
		
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'workOrderId',
					'content': req.body.workinfo.id
				},
				{
					'name': 'workType',
					'content': req.body.workinfo.type
				},
				{
					'name': 'toName',
					'content': req.body.workinfo.toWhomName
				},
				{
					'name': 'serviceCenter',
					'content': req.body.workinfo.serviceCenter
				},
				{
					'name': 'customContent',
					'content': req.body.workinfo.content || ''
				},

				{
					'name': 'date',
					'content': new Date()
				},

				{
					'name': 'vehicleYear',
					'content': req.body.offender.vehicleYear
				},

				{
					'name': 'offenderName',
					'content': req.body.offender.firstName+' '+req.body.offender.lastName
				},
				{
					'name': 'vehicleMake',
					'content': req.body.offender.vehicleMake
				},
				{
					'name': 'vehicleModel',
					'content': req.body.offender.vehicleModel
				},
				{
					'name': 'driverNumber',
					'content': req.body.offender.driverNumber
				},
				{
					'name': 'workorderid',
					'content': req.body.workinfo._id
				}




				]
	}],
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
'attachments': [{
		'type': 'application/pdf; name=SignedWorkOrder.pdf',
		'name': 'SignedWorkOrder.pdf',
		'content': content
	}]
	
};



var template_name='carefree-iid-signedworkauth';

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
	res.status(200).send(mypdf);
},
function(e){
	//console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});

// runAuth(req.body.offender);
// res.status(200).send(mypdf);
}



});

return;
};





//Send Customer Service Agreement

exports.viewOrder = function(req, res){

	console.log('Showing Work Order Now');
	console.log(req.body);
	console.log(req.query);
	console.log(req.params);
	console.log('Did we find Workorder Info, Offender Info, and User info?');
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress,
	timesrun = 0;
	var timesrun = 0;
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var date = new Date(Date.now());
	var d = date.getDate();
	var m = date.getMonth()+1;
	var y = date.getYear()-100;
	var prepDate = m+'/'+d+'/'+y;

	//Variables to fill out
	var termLength = req.body.offender.term;
	
	var workCharge;
	if(req.body.workinfo.type==='New Install') {
		workCharge =  req.body.workinfo.amount || 89;
	
	}
	else if(req.body.workinfo.type==='Reset') {
		workCharge = 50;
	
	}else if(req.body.workinfo.type==='Removal') {
		workCharge = 75;
	
	}

	// //console.log('Quote Date: ',prepDate)

	//var name = req.query.name;
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'Work_Auth.pdf';
	// doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];

		if(req.body.workinfo.type==='New Install'){
			//Generate New Install Agreement
			doc.image('images/cusAgreementPg1.png', 2, 2,{width: 610});
		
		//Place Term Length on contract
		doc.y = 217;
		doc.x = 320;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(termLength,{
			// align: 'center'
		});

		doc.addPage();

		//Page 2 
		doc.image('images/cusAgreementPg2.png', 0, 0,{width: 600});


		//Place Vehicle Info
		doc.y = 298;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
	
			align: 'center'
		});

		//Place Service Center Address
		doc.y = 347;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.workinfo.svcAddress,{
	
			align: 'center'
		});


		doc.addPage();

		//Page 3
		doc.image('images/cusAgreementPg3.png', 0, 0,{width: 600});
		//Device Serial Number
		doc.y = 460;
		doc.x = 355;
		doc.fontSize(14);
		doc.text(req.body.workinfo.deviceSN || 'TBD');

		doc.addPage();

		//Page 4
		doc.image('images/cusAgreementPg4.png', 0, 0,{width: 600});
		
		//Place Service Center Address
		doc.y = 47;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.displayName,{
	
			// align: 'center'
		});
		} else {
			//generate Generic Work ORder

		doc.image('budgetlogo.png', 2, 2,{width: 610});
		doc.y = 135;
		doc.x = 70;
		doc.fontSize(30);
		doc.font('Times-Roman');
		doc.fillColor('#1b3959')
		doc.text(req.body.workinfo.type+' Authorization Request',{
			align: 'center'
		});

		doc.y = 270;
		doc.fontSize(17)
		doc.fillColor('black');
		doc.text('Vehicle Info: '+req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
			align: 'center'
		});



		doc.y = 190;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Date: '+prepDate,{
			width: 200,
			align: 'left'
		});

		doc.y = 190;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Service Center: '+req.body.workinfo.serviceCenter,{
			width: 250,
			align: 'left'
		});


		doc.y = 225;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Customer: '+req.body.offender.firstName+' '+req.body.offender.lastName,{
			width: 200,
			align: 'left'
		});

		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Telephone: '+req.body.offender.mainPhone,{
			width: 200,
			align: 'left'
		});



		doc.y = 225;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black');
		doc.text('Driver License #: '+req.body.offender.driverNumber,{
			width: 250,
			align: 'left'
		});

		

		doc.y = 310;
		doc.x = 40;
		doc.fontSize(14)
		doc.fillColor('black');
		doc.text('This form is your invoice, proving that you have approval to have the work completed. This authorization is only good for '+req.body.offender.firstName+' '+req.body.offender.lastName+' at '+req.body.workinfo.serviceCenter+'. Your account will be billed $'+req.body.workinfo.amount+'.00 plus tax for this service.',
			{
				align: 'center',
				width: 500
			});



		doc.y = 662;
		doc.x = 105;
		doc.fontSize(12);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('Customer Printed Name');


		doc.moveTo(100, 660)
		.lineTo(260, 660)
		.stroke();

		//Set Customer Printed Name
		// doc.y = 648;
		// doc.x = 120;
		// doc.fontSize(13);
		// doc.font('Times-Roman');
		// doc.fillColor('black');
		// doc.text(req.body.offender.firstName+' '+req.body.offender.lastName);



		doc.y = 622;
		doc.x = 105;
		doc.fontSize(12);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('Customer Signature');


		doc.moveTo(100, 620)
		.lineTo(260, 620)
		.stroke();

		//Set Signature
		// doc.y = 600;
		// doc.x = 120;
		// doc.fontSize(24);
		// doc.font('SANTO.TTF');
		// doc.fillColor('black');
		// doc.text(req.body.offender.firstName+' '+req.body.offender.lastName);



		doc.y = 685;
		doc.x = 40;
		doc.fontSize(10)
		doc.fillColor('black');
		doc.font('Times-Roman');
		doc.text('By signing this document, I, '+req.body.offender.firstName+' '+req.body.offender.lastName+', agree to waive all liabilities to Budget Ignition Interlock. I agree that I am trusting my vehicle, and therefor ultimately my life, with '+req.body.workinfo.serviceCenter+'. I also consent to being electronically billed $'+workCharge+'.00 plus tax for this service.',
			{
				align: 'center',
				width: 500
			});
		

		}
		


	












doc.on('data', function(chunk){
	chunks.push(chunk);
	
});
 

doc.end();

doc.on('end', function(){
	////console.log(callback);
	////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

			var message = {
	'html': '<p>Approval Copy for </p>',
	
	'subject': 'For Your Records -- Budget IID Approval for '+req.body.workinfo.type,
	'from_email': 'admin@budgetiid.com',
	'from_name': req.body.offender.user.displayName,
	'to': [{
		'email': req.body.workinfo.email,
		'name': req.body.workinfo.toWhomName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'admin@budgetiid.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.body.workinfo.email,
			'vars': [{
					'name': 'serviceCenter',
					'content': req.body.workinfo.serviceCenter
				},
				{
					'name': 'repname',
					'content': req.body.offender.user.displayName
				},
		
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'workOrderId',
					'content': req.body.workinfo.id
				},
				{
					'name': 'workType',
					'content': req.body.workinfo.type
				},
				{
					'name': 'toName',
					'content': req.body.workinfo.toWhomName
				},
				{
					'name': 'serviceCenter',
					'content': req.body.workinfo.serviceCenter
				},
				{
					'name': 'customContent',
					'content': req.body.workinfo.content || ''
				},

				{
					'name': 'date',
					'content': new Date()
				},

				{
					'name': 'vehicleYear',
					'content': req.body.offender.vehicleYear
				},

				{
					'name': 'offenderName',
					'content': req.body.offender.firstName+' '+req.body.offender.lastName
				},
				{
					'name': 'vehicleMake',
					'content': req.body.offender.vehicleMake
				},
				{
					'name': 'vehicleModel',
					'content': req.body.offender.vehicleModel
				},
				{
					'name': 'driverNumber',
					'content': req.body.offender.driverNumber
				},
				{
					'name': 'workorderid',
					'content': req.body.workinfo._id
				}




				]
	}],
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
'attachments': [{
		'type': 'application/pdf; name=Budget_Customer_Agreement.pdf',
		'name': 'Budget_Customer_Agreement.pdf',
		'content': content
	}]
	
};




res.status(200).send(mypdf);


});

return;
};









