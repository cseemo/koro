'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Shop = mongoose.model('Shop'),
	_ = require('lodash');
	var mandrill = require('mandrill-api/mandrill');
	var request = require('request');
	var http = require('http');
	var https = require('https');
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var moment = require('moment');
	var PDFDocument = require('pdfkit');
	var fs=require('fs');

	// console.log('Portal Stuff ', portal);
    var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	


/**
 * Create a Shop
 */
exports.create = function(req, res) {
	console.log('Getting Shop', req.body);
	var shop = new Shop(req.body);
	shop.user = req.user;

	shop.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shop);
		}
	});
};

/**
 * Show the current Shop
 */
exports.read = function(req, res) {
	res.jsonp(req.shop);
};

/**
 * Update a Shop
 */
exports.update = function(req, res) {
	var shop = req.shop ;

	shop = _.extend(shop , req.body);

	shop.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shop);
		}
	});
};

/**
 * Delete an Shop
 */
exports.delete = function(req, res) {
	var shop = req.shop ;

	shop.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shop);
		}
	});
};

/**
 * List of Shops
 */
exports.list = function(req, res) { Shop.find().sort('-created').populate('user', 'displayName').exec(function(err, shops) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(shops);
		}
	});
};

/**
 * Shop middleware
 */
exports.shopByID = function(req, res, next, id) { Shop.findById(id).populate('user', 'displayName').exec(function(err, shop) {
		if (err) return next(err);
		if (! shop) return next(new Error('Failed to load Shop ' + id));
		req.shop = shop ;
		next();
	});
};

/**
 * Shop authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.shop.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.sendAgreement = function(req, res) {
	console.log('Sending Agreement Now');

	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var id = req.shop._id;
	var today = new moment();
	var convertedPretty = moment(today).format("MM/DD/YYYY");
	var fName = req.shop.primarycontactname.split(' ');
	fName = fName[0];
	
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'TestContract.pdf';
	doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	

	//Page 1
	var bg = doc.image('images/page1.png', 0, 0,{width: 600});
	
		//Set Company Name
		doc.y = 220;
		doc.x = 220;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.name);

		//Set Address
		doc.y = 251;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.address);


		//Set City, State, and Zip
		doc.y = 278;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.shop.city+', '+req.shop.state+' '+req.shop.zipcode);


		//Set Name
		doc.y = 300;
		doc.x = 170;
		doc.text(req.shop.primarycontactname);

		//Set Telephone Number
		doc.y = 327;
		doc.x = 170;
		doc.text(req.shop.telephone);

		//Set Fax Number
		doc.y = 353;
		doc.x = 170;
		doc.text(req.shop.fax);

		//Set Email Address
		doc.y = 375;
		doc.x = 170;
		doc.text(req.shop.email);

		//Set Date
		doc.y = 426;
		doc.x = 240;
		doc.fontSize(16);
		doc.text(convertedPretty);





		doc.addPage();

		//Page 2 
		var bg = doc.image('images/page2.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 3
		var bg = doc.image('images/page3.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 4
		var bg = doc.image('images/page4.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 5
		var bg = doc.image('images/page5.png', 0, 0,{width: 600});
		doc.addPage();

		//Page 6
		var bg = doc.image('images/page6.png', 0, 0,{width: 600});

		

		doc.addPage();

		//Page 7
		var bg = doc.image('images/page7.png', 0, 0,{width: 600});



doc.pipe( res );


doc.on('data', function(chunk){
	chunks.push(chunk);
	////////console.log('chunk:', chunk.length);
});
 



doc.end();


doc.on('end', function(){
	////////console.log(callback);
// 	////////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

	//var content = fs.readFileSync(myfileName, 'base64');

		var message = {
	'subject': 'Ignition Interlock Service Center Agreement',
	'from_email': req.user.email,
	'from_name': req.user.displayName,
	'to': [{
		'email': req.shop.email,
		'name': req.shop.primarycontactname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'req.user.email'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.shop.email,
			'vars': [{
					'name': 'fName',
					'content': fName
				},
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'repName',
					'content': req.user.displayName
				},
				{
					'name': 'shopid',
					'content': req.shop._id
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
		'type': 'application/pdf; name=BudgetIID_ServiceCenter_Agreement.pdf',
		'name': 'BudgetIID_ServiceCenter_Agreement.pdf',
		'content': content
	}]
};



var template_name='budget-newshop';

var async = false;


mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	//////console.log('Results from Mandrill', result);
},
function(e){
	//////console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


});
		

	// res.status(222).send('Still Writing Code!');

return

};