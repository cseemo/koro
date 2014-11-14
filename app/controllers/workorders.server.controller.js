'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Workorder = mongoose.model('Workorder'),
	_ = require('lodash'),
	mandrill = require('mandrill-api/mandrill');

	var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	

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


	Workorder.find().sort('-created').populate('user', ['displayName', 'email']).exec(function(err, workorders) {
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
	console.log('Looking for WOrk Order');

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


exports.offenderByID = function(req, res, id) { 
	console.log('Work Order By ID: ', req.body);

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
	if (req.workorder.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


exports.email = function(req, res){

	console.log('Emailing Now');
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
	// //console.log('Quote Date: ',prepDate)

	//var name = req.query.name;
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'Work_Auth.pdf';
	doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	//FILL OUT LD LOA
	// doc.image('sigcert.png', 255, 660);  
	//var bg = doc.image('LOCALLOA.png', 0, 0,{width: 600});
	// var bg2 = doc.image('LDLOA.png', 0, 0,{width: 600});
	//var bg = doc.image('FCTicket.jpg', 0, 0, 600, 800);


		var bg = doc.image('budgetlogo.png', 2, 2,{width: 610});
		
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
		doc.fillColor('black')
		doc.text('Vehicle Info: '+req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
			align: 'center'
		});



		doc.y = 190;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Date: '+prepDate,{
			width: 200,
			align: 'left'
		});

		doc.y = 190;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Service Center: '+req.body.workinfo.serviceCenter,{
			width: 250,
			align: 'left'
		});


		doc.y = 225;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Customer: '+req.body.offender.firstName+' '+req.body.offender.lastName,{
			width: 200,
			align: 'left'
		});

		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Telephone: '+req.body.offender.mainPhone,{
			width: 200,
			align: 'left'
		});



		doc.y = 225;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Driver License #: '+req.body.offender.driverNumber,{
			width: 250,
			align: 'left'
		});

		

		doc.y = 310;
		doc.x = 40;
		doc.fontSize(14)
		doc.fillColor('black')
		doc.text('This form is your invoice, proving that you have approval to have the work completed. This authorization is only good for '+req.body.offender.firstName+' '+req.body.offender.lastName+' at '+req.body.workinfo.serviceCenter+'. Your account will be billed $50.00 for this service.',
			{
				align: 'center',
				width: 500
			});




		// doc.y = 644;
		// doc.x = 270;
		// doc.fontSize(9);
		// doc.font('Times-Roman');
		// doc.fillColor('black');
		// doc.text('TESTING');

		//Set IP Address
		// doc.y = 652;
		// doc.x = 270;
		// doc.fontSize(9);
		// doc.font('Times-Roman');
		// doc.fillColor('black');
		// doc.text('@ '+ip);


		
		//Set Address
		// doc.y = 251;
		// doc.x = 170;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.text('THIS IS THAT');


		// //Set City
		// doc.y = 285;
		// doc.x = 150;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.text('CITY');

		// //Set State
		// doc.y = 285;
		// doc.x = 420;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.text(req.deal.state);

		// //Set Zip
		// doc.y = 285;
		// doc.x = 485;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.text(req.deal.zipcode);

		


		//Set Signature
		// doc.y = 635;
		// doc.x = 97;
		// doc.fontSize(24);
		// doc.font('SANTO.TTF');
		// doc.fillColor('black');
		// doc.text(req.body.offender.firstName+' '+req.body.offender.lastName);

		

		//Set Printed Name
		// doc.y = 670;
		// doc.x = 117;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.fillColor('black');
		// doc.text(req.body.offender.firstName+' '+req.body.offender.lastName);
		
		// doc.moveTo(100, 660)
		// .lineTo(260, 650)
		// .stroke();

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
		doc.fillColor('black')
		doc.font('Times-Roman');
		doc.text('By signing this document, I, '+req.body.offender.firstName+' '+req.body.offender.lastName+', agree to waive all liabilities to Carefree Ignition Interlock. I agree that I am trusting my vehicle, and therefor ultimately my life, with '+req.body.workinfo.serviceCenter+'. I also consent to being electronically billed $50.00 for this service.',
			{
				align: 'center',
				width: 500
			});
		









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
		'type': 'application/pdf; name=CarefreeWorkOrder.pdf',
		'name': 'CarefreeWorkOrder.pdf',
		'content': content
	}]
	
};



var template_name='carefree-iid-workauth';

var async = false;
if(timesrun < 2){

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){
	timesrun++;
	// console.log('Results from Mandrill', result);
	res.status(200).send(mypdf);
},
function(e){
	//console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});

// res.status(200).send(mypdf);
}



});

return;
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
	var myfileName = 'Work_Auth.pdf';
	doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	//FILL OUT LD LOA
	// doc.image('sigcert.png', 255, 660);  
	//var bg = doc.image('LOCALLOA.png', 0, 0,{width: 600});
	// var bg2 = doc.image('LDLOA.png', 0, 0,{width: 600});
	//var bg = doc.image('FCTicket.jpg', 0, 0, 600, 800);


		var bg = doc.image('budgetlogo.png', 2, 2,{width: 610});
		
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
		doc.fillColor('black')
		doc.text('Vehicle Info: '+req.body.offender.vehicleYear+' '+req.body.offender.vehicleMake+' '+req.body.offender.vehicleModel,{
			align: 'center'
		});



		doc.y = 190;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Date: '+prepDate,{
			width: 200,
			align: 'left'
		});

		doc.y = 190;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Service Center: '+req.body.workinfo.serviceCenter,{
			width: 250,
			align: 'left'
		});


		doc.y = 225;
		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Customer: '+req.body.offender.firstName+' '+req.body.offender.lastName,{
			width: 200,
			align: 'left'
		});

		doc.x = 40;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Telephone: '+req.body.offender.mainPhone,{
			width: 200,
			align: 'left'
		});



		doc.y = 225;
		doc.x = 315;
		doc.fontSize(16)
		doc.fillColor('black')
		doc.text('Driver License #: '+req.body.offender.driverNumber,{
			width: 250,
			align: 'left'
		});

		

		doc.y = 310;
		doc.x = 40;
		doc.fontSize(14)
		doc.fillColor('black')
		doc.text('This form is your invoice, proving that you have approval to have the work completed. This authorization is only good for '+req.body.offender.firstName+' '+req.body.offender.lastName+' at '+req.body.workinfo.serviceCenter+'. Your account will be billed $50.00 for this service.',
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
		doc.fillColor('black')
		doc.font('Times-Roman');
		doc.text('By signing this document, I, '+req.body.offender.firstName+' '+req.body.offender.lastName+', agree to waive all liabilities to Carefree Ignition Interlock. I agree that I am trusting my vehicle, and therefor ultimately my life, with '+req.body.workinfo.serviceCenter+'. I also consent to being electronically billed $50.00 for this service.',
			{
				align: 'center',
				width: 500
			});
		









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
	
	'subject': 'For Your Records -- Carefree IID Approval for '+req.body.workinfo.type,
	'from_email': 'admin@carefreeiid.com',
	'from_name': req.body.offender.user.displayName,
	'to': [{
		'email': req.body.workinfo.email,
		'name': req.body.workinfo.toWhomName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'admin@carefreeiid.com'
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

// res.status(200).send(mypdf);
}



});

return;
};







