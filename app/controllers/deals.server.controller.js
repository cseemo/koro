'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Deal = mongoose.model('Deal'),
	_ = require('lodash'),
	mandrill = require('mandrill-api/mandrill');


var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	

//SEND Signed LOAs back to customer
exports.sendSigned = function(req, res) {
console.log('Sending Signed LOAs');
console.log('Req.body %o', req.body);

var message = {
	'html': '<p>Centurylink Signed LOAs</p>',
	'text': 'Centurylink Return Email',
	'subject': 'Letter of Authorization (Centurylink)',
	'from_email': 'yourrep@centurylink.net',
	'from_name': 'Me and You',
	'to': [{
		'email': req.body.email,
		'name': req.body.contactname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'cseemo@gmail.com'
	},
	'important': false,
	'track_opens': null,
	'track_clicks': null,
	'auto_text': null,
	'auto_html': null,
	'inline_css': null,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'signing_domain': null,
	'return_path_domain': null,
	'attachments': [{
		'type': 'application/pdf',
		'name': 'testfule.pdf',
		'content': req.deal._id+'.pdf'
	}]
};

var async = false;

mandrill_client.messages.send({'message': message, 'async': async}, function(result){
	console.log(result);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});

};


//APPROVE A DEAL

/**
 * Create a Deal
 */
exports.create = function(req, res) {
	var deal = new Deal(req.body);
	deal.user = req.user;
	console.log('Chaddeal %o', deal);

	deal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: 'Hmmm...'
			});
		} else {
			res.jsonp(deal);
		}
	});
};

//Get Total MRC Sold by Rep
exports.getDealMRCTotal = function(req, res){
Deal.aggregate([ { $match: {assignedRep:req.user.displayName} }, {
		'$group': { 
			_id: '$mrc',
			total: {
				'$sum': '$mrc'
			}
		}
	}]).exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			var total = 0;
			Object.keys(results).forEach(function(key) {
				total += results[key].total;
			});
			results.push({_id: 'total', 'total': total});
			res.jsonp(results);
		}
	});	


};


//Count Total Deals
exports.getDealsbyTotal = function(req, res) {
	console.log('got to Count Deals FIND USER %o', req.user);

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	Deal.aggregate([  { $match: {assignedRep:req.user.displayName} }, 
	{
		'$group': { 
			_id: '$stage',
			total: {
				'$sum': 1
			}
		}
	}]).exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			var total = 0;
			Object.keys(results).forEach(function(key) {
				total += results[key].total;
			});
			results.push({_id: 'total', 'total': total});
			res.jsonp(results);
		}
	});	
};


//Get Deals
exports.getDEALS = function(req, res) { Deal.find().where({user: req.user.id}).sort('-converted').limit(50).exec(function(err, deals) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			//console.log('leads %o',leads);
			res.jsonp(deals);
		}
	});
};

/**
 * Show the current Deal
 */
exports.read = function(req, res) {
	res.jsonp(req.deal);
};

/**
 * Update a Deal
 */
exports.update = function(req, res) {
	var deal = req.deal ;
	console.log('Deal Start',deal);
	deal = _.extend(deal , req.body);
	console.log('Deal Extended',deal);
	deal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deal);
		}
	});
};

/**
 * Delete an Deal
 */
exports.delete = function(req, res) {
	var deal = req.deal ;

	deal.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deal);
		}
	});
};


//List Deals w/
var cutoff = new Date();
cutoff.setDate(cutoff.getDate()-5);
//MyModel.find({modificationDate: {$lt: cutoff}}, function (err, docs) { ... });

/**
 * List of Deals
 */
exports.list = function(req, res) { Deal.find().sort('-created').populate('user', 'displayName').exec(function(err, deals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deals);
		}
	});
};

/**
 * Deal middleware
 */
exports.dealByID = function(req, res, next, id) { Deal.findById(id).populate('user', 'displayName').exec(function(err, deal) {
		if (err) return next(err);
		if (! deal) return next(new Error('Failed to load Deal ' + id));
		req.deal = deal ;
		next();
	});
};

/**
 * Deal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.deal.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

exports.makePDF = function(req, res){
	var timesrun = 0;
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	console.log('REQ Deal', req.deal);
	var id = req.deal._id;
	// Deal.findById(id).exec(function(err, deal) {
	// 	if (err) return next(err);
	// 	if (! deal) return ('Failed to load Deal ' + id);
	// 	req.deal = deal ;
	// });
	//var signDate = Date.now('EEE MMM d @ hh:mm a');
	var signDate = req.deal.signDate;



	console.log('Making a PDF');
	//console.log('Name: ',req.query.name);
	//var blobStream = require('blob-stream');


	//var name = req.query.name;
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var doc = new PDFDocument();

	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'loa'+req.deal._id+'.pdf';
	doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	//FILL OUT LD LOA
	doc.image('sigcert.png', 255, 655);  
	//var bg = doc.image('LOCALLOA.png', 0, 0,{width: 600});
	var bg2 = doc.image('LDLOA.png', 0, 0,{width: 600});
	//var bg = doc.image('FCTicket.jpg', 0, 0, 600, 800);

		//Set Email
		doc.y = 640;
		doc.x = 250;
		doc.fontSize(9);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('User Email: '+req.deal.contactemail);

		//Set IP Address
		doc.y = 650;
		doc.x = 250;
		doc.fontSize(9);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('User IP: '+ip);


		//Set Company Name
		doc.y = 220;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.companyname);

		//Set Address
		doc.y = 251;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.address);


		//Set City
		doc.y = 285;
		doc.x = 150;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.city);

		//Set State
		doc.y = 285;
		doc.x = 420;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.state);

		//Set Zip
		doc.y = 285;
		doc.x = 485;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.zipcode);

		//Set BTN
		doc.y = 325;
		doc.x = 275;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.telephone);

		//Set Additional Lines
		//Set X Start & Y Start Values
		var xs = 100;
		var ys = 355;
		var i =0;


		//console.log('LineDetails #:', req.deal.lineDetails.length);
		if(req.deal.lineDetails.length > 0){

			//console.log('This account has numbers online');
		
		req.deal.lineDetails.forEach(function(num){
		//console.log('num.number',num.number);
		// console.log(i);
		// console.log('XS: '+xs+' and YS: '+ys);
		if(num!=null){
			//console.log('num.number is here: ',num.number);

		doc.y = ys;
		doc.x = xs;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(num.number);


		i++;
		xs+=150;
		if(i===3){
			ys = 380;
			xs=100;
		}
		if(i===6){
			ys = 400;
			xs=100;
		}
		if(i===9){
			ys = 420;
			xs=100;
		}
		if(i===12){
			ys = 440;
			xs=100;
		}
		if(i===15){
			ys = 465;
			xs=100;
		}
		if(i===18){
			ys = 530;
			xs=100;
		}
		if(i===21){
			ys = 550;
			xs=100;
		}
	}
			
		});
	}else{
		console.log('Sorry no numbers inputted');
		console.log('Length',req.deal.lineDetails);
		console.log('Length',req.deal.lineDetails.length);
	}


		//Set Signature
		doc.y = 635;
		doc.x = 130;
		doc.fontSize(24);
		doc.font('SANTO.TTF');
		doc.fillColor('black');
		doc.text(req.deal.contactname);

		//Set Date
		doc.y = 645;
		doc.x = 460;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(signDate);



		//Set Printed Name
		doc.y = 670;
		doc.x = 160;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(req.deal.contactname);
		doc.image('sigcert.png', 675, 200);

		//Set Title
		doc.y = 670;
		doc.x = 410;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(req.deal.contacttitle);

		doc.addPage();

		//FILL OUT LOCAL LOA
		doc.image('sigcert.png', 255, 685);  
		var bg = doc.image('LOCALLOA.png', 0, 0,{width: 600});
		//var bg = doc.image('LDLOA.png', 0, 0,{width: 600});
		//var bg = doc.image('FCTicket.jpg', 0, 0, 600, 800);

		//Set Email
		doc.y = 670;
		doc.x = 250;
		doc.fontSize(9);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('User Email: '+req.deal.contactemail);

		//Set IP Address
		doc.y = 680;
		doc.x = 250;
		doc.fontSize(9);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('User IP: '+ip);

		//Set Company Name
		doc.y = 220;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.companyname);

		//Set Address
		doc.y = 251;
		doc.x = 170;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.address);


		//Set City
		doc.y = 285;
		doc.x = 150;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.city);

		//Set State
		doc.y = 285;
		doc.x = 420;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.state);

		//Set Zip
		doc.y = 285;
		doc.x = 485;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.zipcode);

		//Set BTN
		doc.y = 325;
		doc.x = 275;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.telephone);

		//Set Additional Lines
		// doc.y = 365;
		// doc.x = 100;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.text('602 555-1322');



		//Set X Start & Y Start Values
		var xs = 100;
		var ys = 365;
		var i =0;

		if(req.deal.lineDetails.length > 0){
			console.log('Got numbers ', req.deal.lineDetails);

			req.deal.lineDetails.forEach(function(num){

			if(num!=null){


				// console.log('hello',num.number);
				// console.log(i);
				// console.log('XS: '+xs+' and YS: '+ys);

				doc.y = ys;
				doc.x = xs;
				doc.fontSize(14);
				doc.font('Times-Roman');
				doc.text(num.number);


				i++;
				xs+=150;
				if(i===3){
					ys = 390;
					xs=100;
				}
				if(i===6){
					ys = 410;
					xs=100;
				}
				if(i===9){
					ys = 430;
					xs=100;
				}
				if(i===12){
					ys = 450;
					xs=100;
				}
				if(i===15){
					ys = 470;
					xs=100;
				}
				if(i===18){
					ys = 530;
					xs=100;
				}
				if(i===21){
					ys = 550;
					xs=100;
				}

			}
			
		});
	}

		// for(var i = 0; i < teln.length; i++){
		// doc.y = ys;
		// doc.x = xs;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.text(teln[i]);

		// xs+=150;
		// if(i==3){
		// 	xs=100;
		// 	ys+=20;
		// }



		// 	}

		//This needs to be a FOR LOOP
		//Add X for each new line
		//If X==3 then Add Y so that it skips to next line

		// //2nd Row of Lines
		// doc.y = 385;
		// doc.x = 100;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.text('602 555-2222');

		// //2nd Column of Lines
		// doc.y = 365;
		// doc.x = 250;
		// doc.fontSize(14);
		// doc.font('Times-Roman');
		// doc.text('602 555-3333');

		//Set Signature
		doc.y = 655;
		doc.x = 130;
		doc.fontSize(24);
		doc.font('SANTO.TTF');
		doc.fillColor('black');
		doc.text(req.deal.contactname);

		//Set Date
		doc.y = 665;
		doc.x = 460;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(signDate);

		//Set Printed Name
		doc.y = 690;
		doc.x = 160;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(req.deal.contactname);
		doc.image('sigcert.png', 675, 200);

		//Set Title
		doc.y = 690;
		doc.x = 410;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(req.deal.contacttitle);


   // Write headers
//     res.writeHead(200, {
//         'Content-Type': 'application/pdf',
//         'Access-Control-Allow-Origin': '*',
//          'X-Frame-Options': 'SAMEORIGIN',
//         'Content-Disposition': 'inline; filename=Centurylink_Signed_LOAs.pdf'
//     });


doc.pipe( res );






doc.on('data', function(chunk){
	chunks.push(chunk);
	console.log('chunk:', chunk.length);
});
 

// buffers.push.bind(buffers));

doc.end();



// doc.on('end', function(){
// 		console.log('doc.on end');
// 		var test = res.toString('base64');

		

		// function (err, data){
		// 	console.log('Sending Email');
		// 	var myPDF = data.toString('base64');

		//res.setHeader('Content-disposition', 'attachment; filename=test');

		// //var test = new Buffer(data, 'base64');
		// var test = data.toString('base64');

doc.on('end', function(){
	//console.log(callback);
	console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

	//var content = fs.readFileSync(myfileName, 'base64');

		var message = {
	'html': '<p>Centurylink Signed LOAs:</p>',
	'text': 'Centurylink Return Email',
	'subject': 'On END -- content chunks to String base64',
	'from_email': 'yourrep@centurylink.net',
	'from_name': 'Using BUffers',
	'to': [{
		'email': req.deal.contactemail,
		'name': req.deal.contactname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'cseemo@gmail.com'
	},
	'important': false,
	'track_opens': null,
	'track_clicks': null,
	'auto_text': null,
	'auto_html': null,
	'inline_css': null,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'signing_domain': null,
	'return_path_domain': null,
	'attachments': [{
		'type': 'application/pdf; name=mytestPDF.pdf',
		'name': 'mytestPDF.pdf',
		'content': content
	}]
};





var async = false;
if(timesrun < 2){

mandrill_client.messages.send({'message': message, 'async': async}, function(result){
	timesrun++;
	console.log('Results from Mandrill', result);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


}





	});
		
		//console.log('Res',res);
		
	
	

		//buffers = buffers.toString('base64');
	//.toString('base64');




// });

//var myPDF 
// stream.on('finish', function(){
// 	iframe.src = stream.toBlobURL('application/pdf');
// });

	//console.log('What is the res???',res);
// var message = {
// 	'html': '<p>Centurylink Signed LOAs</p>',
// 	'text': 'Centurylink Return Email',
// 	'subject': 'Letter of Authorization (Centurylink)',
// 	'from_email': 'yourrep@centurylink.net',
// 	'from_name': 'Test Test',
// 	'to': [{
// 		'email': req.deal.contactemail,
// 		'name': req.deal.contactname,
// 			'type': 'to'
// 	}],
// 	'headers': {
// 		'Reply-To': 'cseemo@gmail.com'
// 	},
// 	'important': false,
// 	'track_opens': null,
// 	'track_clicks': null,
// 	'auto_text': null,
// 	'auto_html': null,
// 	'inline_css': null,
// 	'url_strip_qs': null,
// 	'preserver_recipients': null,
// 	'view_content_link': null,
// 	'bcc_address': 'fivecsconsulting@gmail.com',
// 	'tracking_domain': null,
// 	'signing_domain': null,
// 	'return_path_domain': null,
// 	'attachments': [{
// 		'type': 'application/pdf',
// 		'name': myfileName,
// 		'content': new Buffer(doc).toString('base64')
// 	}]
// };

// doc.end();

// var async = false;

// mandrill_client.messages.send({'message': message, 'async': async}, function(result){
// 	console.log('Results from Mandrill', result);
// },
// function(e){
// 	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
// });
return;
};

