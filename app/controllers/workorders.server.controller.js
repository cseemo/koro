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
	   // api: '78HDftF7Gs',
	    // key: '83H8U65tX3ekuFrD', //Chads TEst API
	    api: '5hB56Vus',
	    key: '37HmG92v4J2yDsMp', //Budget Actual API
	    sandbox: false //true // false
	  });

	   var async = require('async');


	   //Download a Signed Agreement
	   	exports.getSignedDoc = function(req, res){
	   		console.log('Getting Signed Docs');
	   		// console.log(req.body);
	   		// console.log(req.query);var offId = req.body.offender._id;
	   		console.log('Offender ID: ', req.offender._id);
	   		console.log('Document to get: ', 'signedCustomer'+req.offender._id+'.pdf');


		// console.log('got here', req.deal);
		// 'signedCustomer'+req.body.workinfo._id+'.pdf';
		res.download('signedCustomer'+req.offender._id+'.pdf', 'signedCustomer'+req.offender._id+'.pdf', function(err){
			if(err){
				console.log('ERROR Downloading PDF - Line 37 WorkordesServerController!!!', err);
			} else {
				console.log('No Errors Downloading', req.offender._id);
			}
			return;
		});
		

	};
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


	Workorder.find(req.query).sort('-created').populate('user').exec(function(err, workorders) {
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


//Send WElcome Email

exports.welcomeEmail = function(req, res){
	console.log('Sending Welcome Email');
	console.log('WorkOrder: ', req.body.workinfo);
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress,
	timesrun = 0;
	
	
	var today = moment().format("MMM DD, YYYY");

	var message = {
	'html': '<p>Welcome Email</p>',
	
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
					'content': 'Service'
				},
				{
					'name': 'toName',
					'content': req.body.offender.firstName+' '+req.body.offender.lastName
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
	// 	'type': 'application/pdf; name=Buget_IID_WorkOrder.pdf',
	// 	'name': 'BudgetWorkOrder.pdf',
	// 	'content': content
	// }, 
	// // { 
 // //                "type": "text/calendar",
 // //                "name": "meeting.ics",
 // //                "content": "QkVHSU46VkNBTEVOREFSDQpWRVJTSU9OOjIuMA0KUFJPRElEOi0vL01lZXRlci9tZWV0ZXIvL05PTlNHTUwgdjEuMC8vRU4NCkNBTFNDQUxFOkdSRUdPUklBTg0KTUVUSE9EOlJFUVVFU1QNCkJFR0lOOlZFVkVOVA0KRFRTVEFSVDoyMDE0MTAxOFQyMDMwMDBaDQpEVEVORDoyMDE0MTAxOFQyMTAwMDBaDQpVSUQ6MjAxNDEwMTVUMDAyODEzLTIyMzc4ODg2OEBtZWV0ZXIuY29tDQpEVFNUQU1QOjIwMTQxMDE0VDIxMjgxM1oNCk9SR0FOSVpFUjtDTj0ic25hZ2dzQGdtYWlsLmNvbSI7U0VOVC1CWT0iTUFJTFRPOnNvbWVhcHBAZ21haWwuY29tIjtMQU5HVUFHRT1zZTpNQUlMVE86c25hZ2dzQGdtYWlsLmNvbQ0KQVRURU5ERUU7Q1VUWVBFPUlORElWSURVQUw7Uk9MRT1SRVEtUEFSVElDSVBBTlQ7UEFSVFNUQVQ9TkVFRFMtQUNUSU9OO1JTVlA9VFJVRTtDTj1GZXNzeSBNO1gtTlVNLUdVRVNUUz0wOk1BSUxUTzpzbmFnZ3MyQGdtYWlsLmNvbQ0KREVTQ1JJUFRJT046ZGRkZCBtYW5kcmlsbA0KTE9DQVRJT046ZGRkZGRkIG1hbmRyaWxsDQpTVU1NQVJZOkNhbiBJIGxheSBsb3c/IENvb2sgc29tZSB5YXkteW8gMg0KVFJBTlNQOk9QQVFVRQ0KU0VRVUVOQ0U6MA0KU1RBVFVTOkNPTkZJUk1FRA0KRU5EOlZFVkVOVA0KRU5EOlZDQUxFTkRBUg=="
 // //            },
 //            // { 
 //            //     "type": "text/calendar",
 //            //     "name": "meeting.ics",
 //            //     "content": test
 //            // }


            }]
        };

var template_name='budget-newcustomerwelcome';
	



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

	
		res.status(200).send('Welcom Email SEnt', id);
	
	
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	


});

// res.status(200).send(mypdf);
}





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
	var waiverTerm = 'By signing this document, I, '+req.body.offender.firstName+' '+req.body.offender.lastName+', agree to have the services requested performed on my vehicle, by '+req.body.workinfo.serviceCenter+'. I also consent to being electronically billed $'+workCharge+'.00 plus tax for this service.';
	
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
			doc.image('images/budgetKS1.png', 0, 0,{width: 580});
		
		//Place Term Length on contract
		doc.y = 340;
		doc.x = 375;
		doc.fontSize(14);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(termLength,{
			// align: 'center'
		});

		doc.addPage();

		//Page 2 
		doc.image('images/budgetKS2.png', 0, 0,{width: 580});




		doc.addPage();

		//Page 3
		doc.image('images/budgetKS3.png', 0, 0,{width: 580});

				//Place Vehicle Info
		doc.y = 130;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
	
			align: 'center'
		});

		//Place Service Center Address
		doc.y = 209;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.workinfo.svcAddress,{
	
			align: 'center'
		});



	

		doc.addPage();

		//Page 4
		doc.image('images/budgetKS4.png', 0, 0,{width: 580});
		
			//Device Serial Number
		doc.y = 265;
		doc.x = 370;
		doc.fontSize(14);
		doc.text(req.body.workinfo.deviceSN || 'TBD');



		// //Place Service Center Address
		// doc.y = 47;
		// doc.x = 50;
		// doc.fontSize(16);
		// doc.font('Times-Roman');
		// // doc.fillColor('#1b3959')
		// doc.text(req.body.offender.displayName,{
	
		// 	// align: 'center'
		// });

		doc.addPage();

		//Page 4
		doc.image('images/budgetKS5.png', 0, 0,{width: 580});
		
		//Place Service Center Address
		doc.y = 44;
		doc.x = 60;
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
		doc.text('Service Authorization Request',{
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
		doc.text('This form is your invoice, proving that you have approval to have the work completed. This authorization is only good for '+req.body.offender.firstName+' '+req.body.offender.lastName+' at '+req.body.workinfo.serviceCenter+', located at '+req.body.workinfo.svcAddress+'. Your account will be billed $'+req.body.workinfo.amount+'.00 plus tax for this service.',
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
		doc.text(waiverTerm, 
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
					'content': 'Service'
				},
				{
					'name': 'toName',
					'content': req.body.offender.firstName+' '+req.body.offender.lastName
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
	}, 
	// { 
 //                "type": "text/calendar",
 //                "name": "meeting.ics",
 //                "content": "QkVHSU46VkNBTEVOREFSDQpWRVJTSU9OOjIuMA0KUFJPRElEOi0vL01lZXRlci9tZWV0ZXIvL05PTlNHTUwgdjEuMC8vRU4NCkNBTFNDQUxFOkdSRUdPUklBTg0KTUVUSE9EOlJFUVVFU1QNCkJFR0lOOlZFVkVOVA0KRFRTVEFSVDoyMDE0MTAxOFQyMDMwMDBaDQpEVEVORDoyMDE0MTAxOFQyMTAwMDBaDQpVSUQ6MjAxNDEwMTVUMDAyODEzLTIyMzc4ODg2OEBtZWV0ZXIuY29tDQpEVFNUQU1QOjIwMTQxMDE0VDIxMjgxM1oNCk9SR0FOSVpFUjtDTj0ic25hZ2dzQGdtYWlsLmNvbSI7U0VOVC1CWT0iTUFJTFRPOnNvbWVhcHBAZ21haWwuY29tIjtMQU5HVUFHRT1zZTpNQUlMVE86c25hZ2dzQGdtYWlsLmNvbQ0KQVRURU5ERUU7Q1VUWVBFPUlORElWSURVQUw7Uk9MRT1SRVEtUEFSVElDSVBBTlQ7UEFSVFNUQVQ9TkVFRFMtQUNUSU9OO1JTVlA9VFJVRTtDTj1GZXNzeSBNO1gtTlVNLUdVRVNUUz0wOk1BSUxUTzpzbmFnZ3MyQGdtYWlsLmNvbQ0KREVTQ1JJUFRJT046ZGRkZCBtYW5kcmlsbA0KTE9DQVRJT046ZGRkZGRkIG1hbmRyaWxsDQpTVU1NQVJZOkNhbiBJIGxheSBsb3c/IENvb2sgc29tZSB5YXkteW8gMg0KVFJBTlNQOk9QQVFVRQ0KU0VRVUVOQ0U6MA0KU1RBVFVTOkNPTkZJUk1FRA0KRU5EOlZFVkVOVA0KRU5EOlZDQUxFTkRBUg=="
 //            },
            // { 
            //     "type": "text/calendar",
            //     "name": "meeting.ics",
            //     "content": test
            // }


            ]
	
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
	// console.log('Result.message', result.message);
	var id = result[0]['_id'];
	console.log('Result[0]', result[0]['_id']);
	console.log('Email ID: ', id);

	
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



exports.sendICS = function(req, res){

	console.log('Emailing Now');
	// console.log(req.body);


	// console.log(req.query);
	// console.log(req.params);
	// console.log('Did we find Workorder Info, Offender Info, and User info?');
	console.log('WorkOrder: ', req.body.workinfo);
	console.log('Offender: ', req.body.offender);
	console.log('User: ', req.body.user);
	console.log('Service Center: '+req.body.workinfo.serviceCenter+' - '+req.body.workinfo.svcAddress);
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

	//Fix Time Zone Issue Here -- Make it Local to the Service Center Zip Code

	// var apptDate = moment(req.body.workinfo.apptDate).format("MM/DD/YYYY [at] hh:mm a");
	var apptDate = moment(req.body.workinfo.apptDate).format("dddd [the] Do [of] MMMM [at] hh:mm a");

	var today = moment().format("MMM DD, YYYY");


	var testDate = Date.now();
	var apptDateStart = moment(req.body.workinfo.apptDate).format("YYYYMMDTHHmmss");
	var apptDateEnd = moment(req.body.workinfo.apptDate).add(1, 'hours').format("YYYYMMDTHHmmss");
	console.log('Appointment Begin: ', apptDateStart);
	console.log('Appointmetn End: ', apptDateEnd);



 
 var testCalendar = 'BEGIN:VCALENDAR\r\n'+
'VERSION:2.0\r\n'+
'PRODID:-//BudgetIID/TechSolutions//NONSGML v1.0//EN\r\n'+
'CALSCALE:GREGORIAN\r\n'+
'METHOD:REQUEST\r\n'+
'BEGIN:VEVENT\r\n'+
'DTSTART:'+apptDateStart+'\r\n'+
'DTEND:'+apptDateEnd+'\r\n'+
// 'UID:20141015T002813-223744868@meeter.com\r\n'+
// 'UID:20141015T002813-cseymour@budgetiid.com\r\n'+

// "UID:20141015T002813-223788868@meeter.com\r\n" +
'UID:'+apptDateStart+'-cseymour@budgetiid.com\r\n'+
// 'UID: 20150119T212813Z-'+req.body.workinfo._id+'@budgetiid.com\r\n'+
'DTSTAMP:'+apptDateStart+'\r\n'+
// 'ORGANIZER;CN=Budget IID:mailto:cseymour@budgetiid.com;SENT-BY=MAILTO:cseymour@budgetiid.com;LANGUAGE=se:MAILTO:'+req.body.offender.offenderEmail+'\r\n'+
'ORGANIZER;CN=mailto:cseymour@budgetiid.com;SENT-BY=MAILTO:cseymour@budgetiid.com;LANGUAGE=se:MAILTO:'+req.body.offender.offenderEmail+'\r\n'+

// 'ORGANIZER;CN="mailto:cseymour@budgetiid.com;SENT-BY=MAILTO:cseymour@budgetiid.com;LANGUAGE=se:MAILTO:'+req.body.offender.offenderEmail+'\r\n'+
'ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN='+req.body.offender.displayName+';X-NUM-GUESTS=0:MAILTO:'+req.body.offender.offenderEmail+'\r\n'+
'DESCRIPTION:Ignition Interlock Appointment\r\n'+
'LOCATION: '+req.body.workinfo.svcAddress+'\r\n'+
'SUMMARY: Before Apple Test\r\n'+
'BEGIN:VALARM\r\n'+
'TRIGGER:-PT1H\r\n'+
// 'REPEAT:1\r\n'+
// 'DURATION:PT15M\r\n'+
// 'ACTION:DISPLAY\r\n'+
// 'DESCRIPTION:Reminder\r\n'+
'END:VALARM\r\n'+
'TRANSP:OPAQUE\r\n'+
'SEQUENCE:0\r\n'+
'STATUS:CONFIRMED\r\n'+
'END:VEVENT\r\n'+
'END:VCALENDAR\r\n';

// var appleTest = 'QkVHSU46VkNBTEVOREFSDQpWRVJTSU9OOjIuMA0KQ0FMU0NBTEU6R1JFR09SSUFODQpQUk9ESUQ6LS8vQ0FMRU5EQVJTRVJWRVIuT1JHLy9OT05TR01MIFZlcnNpb24gMS8vRU4NCk1FVEhPRDpSRVFVRVNUDQpCRUdJTjpWRVZFTlQNClRSQU5TUDpPUEFRVUUNCkRURU5EO1RaSUQ9QW1lcmljYS9EZW52ZXI6MjAxNTAxMTVUMTAwMDAwDQpYLUFQUExFLVNUUlVDVFVSRUQtTE9DQVRJT047VkFMVUU9VVJJO1gtQUREUkVTUz1MYWtlIFNob3JlIFdBOw0KIFgtQVBQTEUtUkFESVVTPTIyOS4wMDczODUzNzg2MzI2O1gtVElUTEU9TGFrZSBQbGFjZTpnZW86DQogNDUuNjgwNzgwLC0xMjIuNjg5MzA2DQpVSUQ6NkQ0REMyNDQtMDlGRi00OTcwLUI1REEtMkVBMDYxMUI1NzRCDQpMT0NBVElPTjpMYWtlIFBsYWNlXG5MYWtlIFNob3JlIFdBDQpTRVFVRU5DRTowDQpTVU1NQVJZOkZha2UgTWVldGluZw0KRFRTVEFSVDtUWklEPUFtZXJpY2EvRGVudmVyOjIwMTUwMTE1VDA5MDAwMA0KQ1JFQVRFRDoyMDE1MDExNFQyMjQ4MDhaDQpBVFRFTkRFRTtDTj1EdXN0aW4gQ3JlZWs7Q1VUWVBFPUlORElWSURVQUw7UEFSVFNUQVQ9QUNDRVBURUQ7Uk9MRT1DSEFJUjsNCiBFTUFJTD1kdXN0aW5AdHJ1Y29tLmNvbTptYWlsdG86ZHVzdGluQHRydWNvbS5jb20NCkFUVEVOREVFO0NVVFlQRT1JTkRJVklEVUFMO0VNQUlMPWZpdmVjc2NvbnN1bHRpbmdAZ21haWwuY29tOw0KIFBBUlRTVEFUPU5FRURTLUFDVElPTjtSU1ZQPVRSVUU6bWFpbHRvOmZpdmVjc2NvbnN1bHRpbmdAZ21haWwuY29tDQpEVFNUQU1QOjIwMTUwMTE0VDIyNDkwMloNCk9SR0FOSVpFUjtDTj1EdXN0aW4gQ3JlZWs7RU1BSUw9ZHVzdGluQHRydWNvbS5jb206bWFpbHRvOg0KIDJfVlBLSFZGUzZNR1IzNlE2Wk80QVZOM1lDUTZGVFdCM1FUQUJYNUFKNTZLVURZNjdRM1Y2R0FVSlBTMkgzQkFSRlFRTkZISlpNDQogTVBFUTJAaW1pcC5tZS5jb20NCkVORDpWRVZFTlQNCkVORDpWQ0FMRU5EQVI=';

var apple = 'BEGIN:VCALENDAR\r\n'+
'VERSION:2.0\r\n'+
'CALSCALE:GREGORIAN\r\n'+
'PRODID:-//Budget IID//Interlock Calendar 0.4//EN\r\n'+
'METHOD:REQUEST\r\n'+
'BEGIN:VEVENT\r\n'+
'TRANSP:OPAQUE\r\n'+
'DTEND;TZID=America/Denver:'+apptDateEnd+'\r\n'+
// 'X-APPLE-STRUCTURED-LOCATION;VALUE=URI;X-ADDRESS=Lake Shore WA;'+
//  'X-APPLE-RADIUS=229.0073853786326;X-TITLE=Lake Place:geo:'+
//  '45.680780,-122.689306\r\n'+
// 'UID:6D4DC244-09FF-4970-B5DA-2EA0611B574B\r\n'+

'UID:'+apptDateStart+'-cseymour@budgetiid.com\r\n'+
'LOCATION:'+req.body.workinfo.svcAddress+'\r\n'+
'SEQUENCE:0\r\n'+
'SUMMARY: Ignition Interlock Appointment @ '+apptDate+'!!!!\r\n'+ //Ignition Interlock Service Appointment at '+req.body.workinfo.serviceCenter+'\r\n'+
'DTSTART;TZID=America/Phoenix:'+apptDateStart+'\r\n'+
'CREATED:20150114T224808Z\r\n'+
// 'ATTENDEE;CN=Dustin Creek;CUTYPE=INDIVIDUAL;PARTSTAT=ACCEPTED;ROLE=CHAIR;'+
//  'EMAIL=dustin@budgetiid.com:mailto:dustin@BudgetIID.com\r\n'+

// 'ATTENDEE;CN=Budget Chad;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;CN=Budget Portal;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:cseymour@budgetiid.com;'+
//  'EMAIL=cseymour@budgetiid.com:mailto:cseymour@budget.com\r\n'+

// 'ATTENDEE;CN=Allan Taylor;CUTYPE=INDIVIDUAL;PARTSTAT=ACCEPTED;'+
//  'EMAIL=allan@budgetiid.com:mailto:allan@budgetiid.com\r\n'+
'ATTENDEE;CUTYPE=INDIVIDUAL;EMAIL=cseymour@budgetiid.com;'+
 'ROLE=PARTICIPANT;CN=Budget Portal;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:cseymour@budgetiid.com\r\n'+



'ATTENDEE;CUTYPE=INDIVIDUAL;EMAIL='+req.body.offender.offenderEmail+';'+
 'ROLE=REQ-PARTICIPANT;CN='+req.body.offender.displayName+';PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:'+req.body.offender.offenderEmail+'\r\n'+
'DTSTAMP:20150114T224902Z\r\n'+
'ORGANIZER;CN=Software;CUTYPE=INDIVIDUAL;PARTSTAT=ACCEPTED;ROLE=CHAIR;EMAIL=fivecsconsulting@gmail.com:mailto:'+
 'fivecsconsulting@gmail.com\r\n'+
// 'ORGANIZER;CN=Dustin Creek;EMAIL=dustin@trucom.com:mailto:'+
//  '2_VPKHVFS6MGR36Q6ZO4AVN3YCQ6FTWB3QTABX5AJ56KUDY67Q3V6GAUJPS2H3BARFQQNFHJZM'+
//  'MPEQ2@imip.me.com\r\n'+

'CLASS:PUBLIC\r\n'+
'END:VEVENT\r\n'+
'END:VCALENDAR\r\n';

var appleTest = new Buffer(apple).toString('base64');
	console.log('Apple Test: ', appleTest);


var appleTest2 = 'QkVHSU46VkNBTEVOREFSDQpWRVJTSU9OOjIuMA0KQ0FMU0NBTEU6R1JFR09SSUFODQpQUk9ESUQ6'+
'LS8vQ0FMRU5EQVJTRVJWRVIuT1JHLy9OT05TR01MIFZlcnNpb24gMS8vRU4NCk1FVEhPRDpSRVFV'+
'RVNUDQpCRUdJTjpWVElNRVpPTkUNClRaSUQ6QW1lcmljYS9EZW52ZXINClgtTElDLUxPQ0FUSU9O'+
'OkFtZXJpY2EvRGVudmVyDQpCRUdJTjpTVEFOREFSRA0KRFRTVEFSVDoxODgzMTExOFQxMjAwMDQN'+
'ClJEQVRFO1ZBTFVFPURBVEUtVElNRToxODgzMTExOFQxMjAwMDQNClRaTkFNRTpNU1QNClRaT0ZG'+
'U0VURlJPTTotMDY1OQ0KVFpPRkZTRVRUTzotMDcwMA0KRU5EOlNUQU5EQVJEDQpCRUdJTjpEQVlM'+
'SUdIVA0KRFRTVEFSVDoxOTE4MDMzMVQwMjAwMDANClJSVUxFOkZSRVE9WUVBUkxZO1VOVElMPTE5'+
'MTkwMzMwVDA5MDAwMFo7QllEQVk9LTFTVTtCWU1PTlRIPTMNClRaTkFNRTpNRFQNClRaT0ZGU0VU'+
'RlJPTTotMDcwMA0KVFpPRkZTRVRUTzotMDYwMA0KRU5EOkRBWUxJR0hUDQpCRUdJTjpTVEFOREFS'+
'RA0KRFRTVEFSVDoxOTE4MTAyN1QwMjAwMDANClJSVUxFOkZSRVE9WUVBUkxZO1VOVElMPTE5MTkx'+
'MDI2VDA4MDAwMFo7QllEQVk9LTFTVTtCWU1PTlRIPTEwDQpUWk5BTUU6TVNUDQpUWk9GRlNFVEZS'+
'T006LTA2MDANClRaT0ZGU0VUVE86LTA3MDANCkVORDpTVEFOREFSRA0KQkVHSU46U1RBTkRBUkQN'+
'CkRUU1RBUlQ6MTkyMDAxMDFUMDAwMDAwDQpSREFURTtWQUxVRT1EQVRFLVRJTUU6MTkyMDAxMDFU'+
'MDAwMDAwDQpSREFURTtWQUxVRT1EQVRFLVRJTUU6MTk0MjAxMDFUMDAwMDAwDQpSREFURTtWQUxV'+
'RT1EQVRFLVRJTUU6MTk0NjAxMDFUMDAwMDAwDQpSREFURTtWQUxVRT1EQVRFLVRJTUU6MTk2NzAx'+
'MDFUMDAwMDAwDQpUWk5BTUU6TVNUDQpUWk9GRlNFVEZST006LTA3MDANClRaT0ZGU0VUVE86LTA3'+
'MDANCkVORDpTVEFOREFSRA0KQkVHSU46REFZTElHSFQNCkRUU1RBUlQ6MTkyMDAzMjhUMDIwMDAw'+
'DQpSUlVMRTpGUkVRPVlFQVJMWTtVTlRJTD0xOTIxMDMyN1QwOTAwMDBaO0JZREFZPS0xU1U7QllN'+
'T05USD0zDQpUWk5BTUU6TURUDQpUWk9GRlNFVEZST006LTA3MDANClRaT0ZGU0VUVE86LTA2MDAN'+
'CkVORDpEQVlMSUdIVA0KQkVHSU46U1RBTkRBUkQNCkRUU1RBUlQ6MTkyMDEwMzFUMDIwMDAwDQpS'+
'REFURTtWQUxVRT1EQVRFLVRJTUU6MTkyMDEwMzFUMDIwMDAwDQpSREFURTtWQUxVRT1EQVRFLVRJ'+
'TUU6MTkyMTA1MjJUMDIwMDAwDQpSREFURTtWQUxVRT1EQVRFLVRJTUU6MTk0NTA5MzBUMDIwMDAw'+
'DQpUWk5BTUU6TVNUDQpUWk9GRlNFVEZST006LTA2MDANClRaT0ZGU0VUVE86LTA3MDANCkVORDpT'+
'VEFOREFSRA0KQkVHSU46REFZTElHSFQNCkRUU1RBUlQ6MTk0MjAyMDlUMDIwMDAwDQpSREFURTtW'+
'QUxVRT1EQVRFLVRJTUU6MTk0MjAyMDlUMDIwMDAwDQpUWk5BTUU6TVdUDQpUWk9GRlNFVEZST006'+
'LTA3MDANClRaT0ZGU0VUVE86LTA2MDANCkVORDpEQVlMSUdIVA0KQkVHSU46REFZTElHSFQNCkRU'+
'U1RBUlQ6MTk0NTA4MTRUMTcwMDAwDQpSREFURTtWQUxVRT1EQVRFLVRJTUU6MTk0NTA4MTRUMTcw'+
'MDAwDQpUWk5BTUU6TVBUDQpUWk9GRlNFVEZST006LTA2MDANClRaT0ZGU0VUVE86LTA2MDANCkVO'+
'RDpEQVlMSUdIVA0KQkVHSU46REFZTElHSFQNCkRUU1RBUlQ6MTk2NTA0MjVUMDIwMDAwDQpSUlVM'+
'RTpGUkVRPVlFQVJMWTtVTlRJTD0xOTY2MDQyNFQwOTAwMDBaO0JZREFZPS0xU1U7QllNT05USD00'+
'DQpUWk5BTUU6TURUDQpUWk9GRlNFVEZST006LTA3MDANClRaT0ZGU0VUVE86LTA2MDANCkVORDpE'+
'QVlMSUdIVA0KQkVHSU46U1RBTkRBUkQNCkRUU1RBUlQ6MTk2NTEwMzFUMDIwMDAwDQpSUlVMRTpG'+
'UkVRPVlFQVJMWTtVTlRJTD0xOTY2MTAzMFQwODAwMDBaO0JZREFZPS0xU1U7QllNT05USD0xMA0K'+
'VFpOQU1FOk1TVA0KVFpPRkZTRVRGUk9NOi0wNjAwDQpUWk9GRlNFVFRPOi0wNzAwDQpFTkQ6U1RB'+
'TkRBUkQNCkJFR0lOOkRBWUxJR0hUDQpEVFNUQVJUOjE5NjcwNDMwVDAyMDAwMA0KUlJVTEU6RlJF'+
'UT1ZRUFSTFk7VU5USUw9MTk3MzA0MjlUMDkwMDAwWjtCWURBWT0tMVNVO0JZTU9OVEg9NA0KVFpO'+
'QU1FOk1EVA0KVFpPRkZTRVRGUk9NOi0wNzAwDQpUWk9GRlNFVFRPOi0wNjAwDQpFTkQ6REFZTElH'+
'SFQNCkJFR0lOOlNUQU5EQVJEDQpEVFNUQVJUOjE5NjcxMDI5VDAyMDAwMA0KUlJVTEU6RlJFUT1Z'+
'RUFSTFk7VU5USUw9MjAwNjEwMjlUMDgwMDAwWjtCWURBWT0tMVNVO0JZTU9OVEg9MTANClRaTkFN'+
'RTpNU1QNClRaT0ZGU0VURlJPTTotMDYwMA0KVFpPRkZTRVRUTzotMDcwMA0KRU5EOlNUQU5EQVJE'+
'DQpCRUdJTjpEQVlMSUdIVA0KRFRTVEFSVDoxOTc0MDEwNlQwMjAwMDANClJEQVRFO1ZBTFVFPURB'+
'VEUtVElNRToxOTc0MDEwNlQwMjAwMDANClJEQVRFO1ZBTFVFPURBVEUtVElNRToxOTc1MDIyM1Qw'+
'MjAwMDANClRaTkFNRTpNRFQNClRaT0ZGU0VURlJPTTotMDcwMA0KVFpPRkZTRVRUTzotMDYwMA0K'+
'RU5EOkRBWUxJR0hUDQpCRUdJTjpEQVlMSUdIVA0KRFRTVEFSVDoxOTc2MDQyNVQwMjAwMDANClJS'+
'VUxFOkZSRVE9WUVBUkxZO1VOVElMPTE5ODYwNDI3VDA5MDAwMFo7QllEQVk9LTFTVTtCWU1PTlRI'+
'PTQNClRaTkFNRTpNRFQNClRaT0ZGU0VURlJPTTotMDcwMA0KVFpPRkZTRVRUTzotMDYwMA0KRU5E'+
'OkRBWUxJR0hUDQpCRUdJTjpEQVlMSUdIVA0KRFRTVEFSVDoxOTg3MDQwNVQwMjAwMDANClJSVUxF'+
'OkZSRVE9WUVBUkxZO1VOVElMPTIwMDYwNDAyVDA5MDAwMFo7QllEQVk9MVNVO0JZTU9OVEg9NA0K'+
'VFpOQU1FOk1EVA0KVFpPRkZTRVRGUk9NOi0wNzAwDQpUWk9GRlNFVFRPOi0wNjAwDQpFTkQ6REFZ'+
'TElHSFQNCkJFR0lOOkRBWUxJR0hUDQpEVFNUQVJUOjIwMDcwMzExVDAyMDAwMA0KUlJVTEU6RlJF'+
'UT1ZRUFSTFk7QllEQVk9MlNVO0JZTU9OVEg9Mw0KVFpOQU1FOk1EVA0KVFpPRkZTRVRGUk9NOi0w'+
'NzAwDQpUWk9GRlNFVFRPOi0wNjAwDQpFTkQ6REFZTElHSFQNCkJFR0lOOlNUQU5EQVJEDQpEVFNU'+
'QVJUOjIwMDcxMTA0VDAyMDAwMA0KUlJVTEU6RlJFUT1ZRUFSTFk7QllEQVk9MVNVO0JZTU9OVEg9'+
'MTENClRaTkFNRTpNU1QNClRaT0ZGU0VURlJPTTotMDYwMA0KVFpPRkZTRVRUTzotMDcwMA0KRU5E'+
'OlNUQU5EQVJEDQpFTkQ6VlRJTUVaT05FDQpCRUdJTjpWRVZFTlQNClRSQU5TUDpPUEFRVUUNCkRU'+
'RU5EO1RaSUQ9QW1lcmljYS9EZW52ZXI6MjAxNTAxMTVUMTAwMDAwDQpYLUFQUExFLVNUUlVDVFVS'+
'RUQtTE9DQVRJT047VkFMVUU9VVJJO1gtQUREUkVTUz1MYWtlIFNob3JlIFdBOw0KIFgtQVBQTEUt'+
'UkFESVVTPTIyOS4wMDczODUzNzg2MzI2O1gtVElUTEU9TGFrZSBQbGFjZTpnZW86DQogNDUuNjgw'+
'NzgwLC0xMjIuNjg5MzA2DQpVSUQ6NkQ0REMyNDQtMDlGRi00OTcwLUI1REEtMkVBMDYxMUI1NzRC'+
'DQpMT0NBVElPTjpMYWtlIFBsYWNlXG5MYWtlIFNob3JlIFdBDQpTRVFVRU5DRTowDQpTVU1NQVJZ'+
'OkZha2UgTWVldGluZw0KRFRTVEFSVDtUWklEPUFtZXJpY2EvRGVudmVyOjIwMTUwMTE1VDA5MDAw'+
'MA0KQ1JFQVRFRDoyMDE1MDExNFQyMjQ4MDhaDQpBVFRFTkRFRTtDTj1EdXN0aW4gQ3JlZWs7Q1VU'+
'WVBFPUlORElWSURVQUw7UEFSVFNUQVQ9QUNDRVBURUQ7Uk9MRT1DSEFJUjsNCiBFTUFJTD1kdXN0'+
'aW5AdHJ1Y29tLmNvbTptYWlsdG86ZHVzdGluQHRydWNvbS5jb20NCkFUVEVOREVFO0NVVFlQRT1J'+
'TkRJVklEVUFMO0VNQUlMPWZpdmVjc2NvbnN1bHRpbmdAZ21haWwuY29tOw0KIFBBUlRTVEFUPU5F'+
'RURTLUFDVElPTjtSU1ZQPVRSVUU6bWFpbHRvOmZpdmVjc2NvbnN1bHRpbmdAZ21haWwuY29tDQpE'+
'VFNUQU1QOjIwMTUwMTE0VDIyNDkwMloNCk9SR0FOSVpFUjtDTj1EdXN0aW4gQ3JlZWs7RU1BSUw9'+
'ZHVzdGluQHRydWNvbS5jb206bWFpbHRvOg0KIDJfVlBLSFZGUzZNR1IzNlE2Wk80QVZOM1lDUTZG'+
'VFdCM1FUQUJYNUFKNTZLVURZNjdRM1Y2R0FVSlBTMkgzQkFSRlFRTkZISlpNDQogTVBFUTJAaW1p'+
'cC5tZS5jb20NCkVORDpWRVZFTlQNCkVORDpWQ0FMRU5EQVINCg==';

 
//  var testCalenda2r = 'BEGIN:VCALENDAR\r\n'+
// 'VERSION:2.0\r\n'+
// 'PRODID:-//BudgetIID/TechSolutions//NONSGML v1.0//EN\r\n'+
// 'CALSCALE:GREGORIAN\r\n'+
// 'METHOD:REQUEST\r\n'+
// 'BEGIN:VEVENT\r\n'+
// 'DTSTART:'+apptDateStart+'\r\n'+
// 'DTEND:'+apptDateEnd+'\r\n'+
// // 'UID:20141015T002813-223744868@meeter.com\r\n'+
// // 'UID:20141015T002813-cseymour@budgetiid.com\r\n'+

// // "UID:20141015T002813-223788868@meeter.com\r\n" +
// 'UID:'+apptDateStart+'-cseymour@budgetiid.com\r\n'+
// // 'UID: 20150119T212813Z-'+req.body.workinfo._id+'@budgetiid.com\r\n'+
// 'DTSTAMP:'+testDate+'\r\n'+
// 'ORGANIZER;CN=mailto:cseymour@budgetiid.com;SENT-BY=MAILTO:cseymour@budgetiid.com;LANGUAGE=se:MAILTO:'+req.body.offender.offenderEmail+'\r\n'+
// 'ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=Budget IID;X-NUM-GUESTS=0:MAILTO:'+req.body.offender.offenderEmail+'\r\n'+
// 'DESCRIPTION:Ignition Interlock Appointment\r\n'+
// 'LOCATION: '+req.body.workinfo.svcAddress+'\r\n'+
// 'SUMMARY: Interlock Service Appointment\r\n'+
// 'BEGIN:VALARM\r\n'+
// 'TRIGGER:-PT20M\r\n'+
// // 'REPEAT:1\r\n'+
// // 'DURATION:PT15M\r\n'+
// // 'ACTION:DISPLAY\r\n'+
// // 'DESCRIPTION:Reminder\r\n'+
// 'END:VALARM\r\n'+
// 'TRANSP:OPAQUE\r\n'+
// 'SEQUENCE:0\r\n'+
// 'STATUS:CONFIRMED\r\n'+
// 'END:VEVENT\r\n'+
// 'END:VCALENDAR\r\n';

var test = new Buffer(testCalendar).toString('base64');
	console.log('Test: ', test);

	

			var message = {
	'html': '<p>Appointment Reminder</p>',
	
	'subject': 'Ignition Interlock Appointment Reminder',
	'from_email': req.body.user.email,
	'from_name': req.body.user.displayName,
	'to': [{
		'email': req.body.offender.offenderEmail,
		'name': req.body.offender.displayName,
			'type': 'to'
	}, 
	{
		'email': 'cseymour@budgetiid.com',
		'name': 'Budget Shop Calendar',
			'type': 'to'
	}],
	'headers': {
		'Reply-To': req.body.user.email
	},
	'merge': true,
	'global_merge_vars': [{
	// 	'name': 'merge1',
	// 	'content': 'merge1 content'
	// }],
	// 'merge_vars': [{
	// 		'rcpt': req.body.offender.offenderEmail,
			// 'vars': [{
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
					'content': 'Service'
				},
				{
					'name': 'toName',
					'content': req.body.offender.firstName+' '+req.body.offender.lastName
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
				// }





				// ]
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
		
                "type": "text/calendar",
                "name": "meeting.ics",
                "content": appleTest
            }


            ]
	
};

var template_name = 'budget-newinstallcalendar';

// if(req.body.workinfo.type==='New Install') {
// 		template_name='carefree-newclient';
	
// 	}
// 	else{
// 		template_name='carefree-iid-workauth';
// 	}



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

	
		res.status(200).send(result);
	
	
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	


});

// res.status(200).send(mypdf);
}


return;
};

//Send Appointment Notification
//Create Payment Profile 

var createPaymentProfile = function(customerId, body, card, next){
	
	console.log('Customer ID: ', customerId);
	console.log('Body: ', body);
	var cus = body.offender;
	console.log('Cus: ', cus);
	console.log('Card: ', card);

	var cardZip = body.cardZip || cus.billingZipcode;
	if(body.cardName){
		console.log('Card Name', body.cardName);
		var name =  body.cardName.split(" ");
		var fName = name[0];
		console.log('FirstName: ', fName);
		var lName = name[1];
		console.log('LastName: ', lName);
	}else{
	var fName = cus.firstName;
	var lName = cus.lastName;
	}
	
	if(body.cardZip){
		console.log('Data Card Zip: ', body.cardZip);
	}
	
	console.log('Creating Payment Profile.....Cusomer Details?', cus);
	console.log('Customer ID: ', customerId);
	cus.merchantCustomerId = customerId;

	var cardExp = cus.expYear+'-'+cus.expMonth;
	console.log('Card Details to Charge : ', body.cardNum);

var options = {
  customerType: 'individual',
  billTo: {
  		firstName: fName,
  		lastName: lName,
  		address: cus.billingAddress,
  		city: cus.billingCity,
  		state: cus.billingState,
  		zip: cardZip,
  		phoneNumber: cus.mainPhone
  },
  payment: {
    creditCard: new Authorize.CreditCard({
      cardNumber: body.cardNum,
      expirationDate: body.cardExp,
      cardCode: body.ccv
    })
  }
}

console.log('Payment PRofile Details: ', options);

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
		console.log('Looking for Offender: ', id);

		Offender.findById(id).populate('user', 'displayName').exec(function(err, offender) {
		if (err) console.log('Error; ', err);
		
		if (! offender) return 'Failed to load Offender ' + id;
		
		if(offender){
			console.log('Offender Line 671; ', offender);
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
					next(null,  response.customerPaymentProfileId);
			});
		}
	});

	}
});
	
};

//Create Customer Profile on Authorize.net
var createAuthProfile = function(off, cb) {
	console.log('Creating Authorize.net Profile for: ', off);
	  var customerID2 = off._id.toString();
	  var customerID = customerID2.substring(3, 23);
	  console.log('Customer ID: ', customerID);

	 var profile = {
  merchantCustomerId: customerID,
  description: off.firstName+' '+off.lastName,
  email: off.offenderEmail,
  
};



	AuthorizeCIM.createCustomerProfile({customerProfile: profile}, function(error, response){
		if(error) {
			console.log('ERROR from Auth.net!', error);
			if(error.code==='E00039'){
						//Duplicate -- So We Need to Charge
						console.log('Duplicate Payment Profile - just charge it - Line 711');
						return cb(error);
					}else{
					return cb(new Error('Failed to Create PRofile ' + error));
					}
			
		}

					console.log('Response from Auth.net Line 719', response);
					// console.log('Customer id: ', response.$);
					
					if(response && off.cardNumber.length > 11) {
						console.log('Customer Profile ID: ', response.customerProfileId);
						// createPaymentProfile(response.customerProfileId, off);
					var offender = Offender.findById( off._id).populate('user', 'displayName').exec(function(err, offender) {
					if (err) console.log('Error; ', err);
					
					if (! offender) return 'Failed to load Offender ' + id;
					
					if(offender){
						var cardDetails = {
							cardNumber: off.cardNumber,
							cardExp: off.expYear+'-'+off.expMonth,
							cardCVV: off.cardCVV
						};
						offender.merchantCustomerId = response.customerProfileId;
						offender.save(function(err){
							console.log('Offender has been saved on line 740: ', offender);

							createPaymentProfile(response.customerProfileId, offender, cardDetails, function(err, data){
									if(err){
								console.log('Error from Create Payment Profile: ');
								res.status(402).send(data.message);
							}

							else{
								
									res.status(200).send('Credit Card Valid');
							}
							
						});


						});
						
					}

					});
				} else {
					console.log('Hmmm...not sure ');
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
	  } else if(req.offender.merchantCustomerId){
	  	//Customer has a Merchant ID but no Payment PRofile ID
	  	console.log('Got Merhcant ID only -- need to create a Payment Profile');
	  		createPaymentProfile(response.customerProfileId, off, function(err, data){
						if(err){
					console.log('Error from Create Payment Profile: ');
					res.status(402).send(data.message);
				}

				else{
					
					res.status(200).send('Credit Card Valid');
				}
				
			});

	  } else {
	  	console.log('This customer seems to have no CC Info Setup');

	  	createAuthProfile(req.offender, function(err, resp){
	  		if(err) {

	  			console.log('Error Addint Customer Auth Profile');
	  			if(err.code==='E00039'){
						//Duplicate -- So We Need to Charge
						console.log('Duplicate Payment Profile - just charge it -- Line 825');
						chargeIt(req, res);
					}else{
						console.log('Error updating Auth Profile');
						res.status(402).send(err.message);
					}
	  			
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

var chargeIt = function(req, res, number){
							console.log('ChargeIt: ', req.body);
							var profileId;

							if(req.body.offender.paymentProfileId){
								console.log('Charging card now', req.body.offender.paymentProfileId);
								profileId = req.body.offender.paymentProfileId;

							}else{
								console.log('Charging Card Now...910: ', number);
								profileId = number;
							}
							console.log('Profile ID to Charge: ', profileId);
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
							  customerPaymentProfileId: profileId,
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


};

var chargeCreditCard = function(req, res, paymentProfile){
	console.log('Charging Card',paymentProfile );

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
					  customerPaymentProfileId: paymentProfile.customerPaymentProfileId,
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
	}


};

var chargeNewCard = function(req, res){
	console.log('Creating New Payment Profile', req.body);

		//Create New Auth Pyament PRofile
		if(req.body.cardName){
		console.log('Card Name', req.body.cardName);
		var name =  req.body.cardName.split(" ");
		var fName = name[0];
		console.log('Fname: ', fName);
		var lName = name[1];
		console.log('Lname: ', lName);
	}else{
	var fName = req.body.offender.firstName;
	var lName = req.body.offender.lastName;
	}

		var options = {
		  customerType: 'individual',
		  billTo: {
		  		firstName: fName,
		  		lastName: lName,
		  		address: req.body.offender.billingAddress,
		  		city: req.body.offender.billingCity,
		  		state: req.body.offender.billingState,
		  		zip: req.body.cardZip,
		  		phoneNumber: req.body.offender.mainPhone
		  },
		  payment: {
		    creditCard: new Authorize.CreditCard({
		      cardNumber: req.body.cardNum,
		      expirationDate: req.body.cardExp,
		      cardCode: req.body.ccv
		    })
		  }
		}

		console.log('Payment PRofile Details: ', options);
		var paymentProfileId;
		AuthorizeCIM.createCustomerPaymentProfile({
		  customerProfileId: req.body.offender.merchantCustomerId,
		  paymentProfile: options
		}, function(err, response) {
			if(err) {
				console.log('ERROR:::', err);
				console.log('Error Creating Payment Profile Line 1089', err);
				res.status(400).send(err.message);
			} else {
				console.log('Response from Payment Profile, ', response);
				paymentProfileId = response.customerPaymentProfileId;
				console.log('Payment Profile ID: ', paymentProfileId);

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
							  customerPaymentProfileId: paymentProfileId,
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
					} else {

						console.log('Card has been charged!!', response);
						res.status(200).send(response);
					}
				});
			}

		}
		})

};

exports.chargeCCard = function(req, res) {
	console.log('Charging Card via Auth.net', req.body);
	if(req.body.paymentProfile){
		console.log('We have a profile to charge against...', req.body.paymentProfile);
		chargeCreditCard(req, res, req.body.paymentProfile);

	}
	if(req.body.type==='new'){
		console.log('Running New Card');
		chargeNewCard(req, res);
	}



// 	if(req.body.setupProfile){
// 		console.log('Need to Setup the Payment Profile first');

// 		// console.log('This customer seems to have no CC Info Setup', req.body.offender);
// 			req.body.offender.cardNumber = req.body.cardNum;
//       		req.body.offender.expYear = req.body.expYear;
//       		req.body.offender.expMonth = req.body.expMonth;
//       		var expDate = req.body.expYear+'-'+req.body.expMonth;
//       		// testCharge(req.body.cardNum, expDate, req.body.ccv);
//       		req.body.offender.cardCVV = req.body.ccv;
//       		var cardDetails = {
// 				cardNumber: req.body.cardNumber,
// 				cardExp: req.body.cardExp,
// 				cardCVV: req.body.cardCVV
// 			};

// 		if(req.body.offender.merchantCustomerId && req.body.offender.paymentProfileId){
// 			console.log('Customer is ready to go -- just need to charge teh card');
// 			chargeIt(req, res);

// 		}else 
// 		if(req.body.offender.merchantCustomerId){
// 			console.log('Already setup with Authorize.net - creating new Payment Profile now');
// 			// AuthorizeCIM.getCustomerProfile(req.body.offender.merchantCustomerId, function(err, response) {
// 			// 	if(err) console.log('Error getting Profile for ', req.body.offender.merchantCustomerId);

// 			// 	console.log('Profile Response: ', response);
// 			// });
// 			createPaymentProfile(req.body.offender.merchantCustomerId, req.body, cardDetails, function(err, data){
// 				if(err){
// 					console.log('Error from Create Payment Profile: ', err);
// 					if(err.code==='E00039'){
// 						//Duplicate -- So We Need to Charge
// 						console.log('Duplicate Payment Profile - just charge it');
// 						chargeIt(req, res);
// 					}else{
// 						res.status(402).send(err.message);
// 					}
					
// 				}else{
// 					console.log('Response line 1005: ', data);
// 					chargeIt(req, res, data);
					
// 				}
// 			});
// 		}else{
// 			console.log('No Authorize.net Profile');
// 			console.log('Creating a New Auth.net profile');
		
// 	  		createAuthProfile(req.body.offender, function(err, resp){

// 	  		if(err) {
// 	  			console.log('Error Line 981',err);
// 	  			if(err.code==='E00039'){
// 						//Duplicate -- So We Need to Charge
// 						console.log('Duplicate Payment Profile - just charge it');
// 						chargeIt(req, res);
// 					}else{
// 						console.log('Error of another sort');
// 						res.status(402).send(err.message);
// 					}
// 	  		}else{
// 	  			console.log('Response from creating Auth PRofile', resp);
// 	  			res.status(200).send('Card Information Updated');
	  			
// 	  		}


// 	  	});
// 		// updateCCInfo(req, res);



// 	}
// }

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
		res.status(400).send(err);
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


		var myfileName;
		if(req.body.workinfo.type==='New Install'){
			myfileName = 'signedCustomer'+req.body.offender._id+'.pdf';
			doc.pipe( fs.createWriteStream(myfileName) );
			console.log('Piping that shit...', myfileName);
		}
	
	 
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

	var waiverTerm = 'By signing this document, I, '+req.body.offender.firstName+' '+req.body.offender.lastName+', agree to have the services requested performed on my vehicle, by '+req.body.workinfo.serviceCenter+'. I also consent to being electronically billed $'+workCharge+'.00 plus tax for this service.';
	
	if(req.body.workinfo.type==='New Install'){

					//Generate New Install Agreement
			doc.image('images/budgetKS1.png', 0, 0,{width: 580});
		
		//Place Term Length on contract
		doc.y = 340;
		doc.x = 375;
		doc.fontSize(14);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(termLength,{
			// align: 'center'
		});

		doc.addPage();

		//Page 2 
		doc.image('images/budgetKS2.png', 0, 0,{width: 580});




		doc.addPage();

		//Page 3
		doc.image('images/budgetKS3.png', 0, 0,{width: 580});

				//Place Vehicle Info
		doc.y = 130;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
	
			align: 'center'
		});

		//Place Service Center Address
		doc.y = 209;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.workinfo.svcAddress,{
	
			align: 'center'
		});



	

		doc.addPage();

		//Page 4
		doc.image('images/budgetKS4.png', 0, 0,{width: 580});
		
			//Device Serial Number
		doc.y = 265;
		doc.x = 370;
		doc.fontSize(14);
		doc.text(req.body.workinfo.deviceSN || 'TBD');


		doc.y = 450;
		doc.x = 380;
		doc.fontSize(14);
		doc.text(convertedPretty);

		doc.y = 355;
		doc.x = 375;
		doc.fontSize(26);
		doc.font('SANTO.TTF');
		doc.text(req.body.offender.displayName);

		doc.y = 405;
		doc.x = 375;
		doc.fontSize(16);
		doc.font('Times-Roman');
		doc.text(req.body.offender.displayName);



		doc.addPage();

		//Page 4
		doc.image('images/budgetKS5.png', 0, 0,{width: 580});
		
		//Place Service Center Address
		doc.y = 44;
		doc.x = 60;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.displayName,{
	
			// align: 'center'
		});

		// //Set Initials
		
		doc.y = 100;
		doc.x = 125;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(initials,{
	
			// align: 'center'
		});

		doc.y = 153;
		doc.x = 125;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(initials,{
	
			// align: 'center'
		});

		doc.y = 207;
		doc.x = 125;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(initials,{
	
			// align: 'center'
		});

		doc.y = 270;
		doc.x = 125;
		doc.fontSize(18);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(initials,{
	
			// align: 'center'
		});

		//Set Signature
		doc.y = 542;
		doc.x = 30;
		doc.fontSize(32);
		doc.font('SANTO.TTF');
		doc.text(req.body.offender.displayName);

		doc.y = 552;
		doc.x = 330;
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
		doc.text('Service Authorization Request',{
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
		doc.text('This form is your invoice, proving that you have approval to have the work completed. This authorization is only good for '+req.body.offender.firstName+' '+req.body.offender.lastName+' at '+req.body.workinfo.serviceCenter+', located at '+req.body.workinfo.svcAddress+'. Your account will be billed $'+req.body.workinfo.amount+'.00 plus tax for this service.',
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
		doc.text(waiverTerm,
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
	
	'subject': 'For Your Records -- Budget IID Approval for Service',
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
					'content': 'Service'
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
		workCharge =  req.body.workinfo.amount || 75;
	
	}
	else if(req.body.workinfo.type==='Reset') {
		workCharge = 50;
	
	}else if(req.body.workinfo.type==='Removal') {
		workCharge = 75;
	
	}

	var waiverTerm = 'By signing this document, I, '+req.body.offender.firstName+' '+req.body.offender.lastName+', agree to have the services requested performed on my vehicle, by '+req.body.workinfo.serviceCenter+'. I also consent to being electronically billed $'+workCharge+'.00 plus tax for this service.';
	

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
			doc.image('images/budgetKS1.png', 0, 0,{width: 580});
		
		//Place Term Length on contract
		doc.y = 340;
		doc.x = 375;
		doc.fontSize(14);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(termLength,{
			// align: 'center'
		});

		doc.addPage();

		//Page 2 
		doc.image('images/budgetKS2.png', 0, 0,{width: 580});




		doc.addPage();

		//Page 3
		doc.image('images/budgetKS3.png', 0, 0,{width: 580});

				//Place Vehicle Info
		doc.y = 130;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
	
			align: 'center'
		});

		//Place Service Center Address
		doc.y = 209;
		doc.x = 50;
		doc.fontSize(16);
		doc.font('Times-Roman');
		// doc.fillColor('#1b3959')
		doc.text(req.body.workinfo.svcAddress,{
	
			align: 'center'
		});



	

		doc.addPage();

		//Page 4
		doc.image('images/budgetKS4.png', 0, 0,{width: 580});
		
			//Device Serial Number
		doc.y = 265;
		doc.x = 370;
		doc.fontSize(14);
		doc.text(req.body.workinfo.deviceSN || 'TBD');



		// //Place Service Center Address
		// doc.y = 47;
		// doc.x = 50;
		// doc.fontSize(16);
		// doc.font('Times-Roman');
		// // doc.fillColor('#1b3959')
		// doc.text(req.body.offender.displayName,{
	
		// 	// align: 'center'
		// });

		doc.addPage();

		//Page 4
		doc.image('images/budgetKS5.png', 0, 0,{width: 580});
		
		//Place Service Center Address
		doc.y = 44;
		doc.x = 60;
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
		doc.text('Service Authorization Request',{
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
		doc.text('This form is your invoice, proving that you have approval to have the work completed. This authorization is only good for '+req.body.offender.firstName+' '+req.body.offender.lastName+' at '+req.body.workinfo.serviceCenter+', located at '+req.body.workinfo.svcAddress+'. Your account will be billed $'+req.body.workinfo.amount+'.00 plus tax for this service.',
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
		doc.text(waiverTerm, {
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
	
	'subject': 'For Your Records -- Budget IID Approval for Service',
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
					'content': 'Service'
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









