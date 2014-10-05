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
////console.log('Sending Signed LOAs');
////console.log('Req.body %o', req.body);

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
	////console.log(result);
},
function(e){
	////console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});

};


//APPROVE A DEAL

/**
 * Create a Deal
 */
exports.create = function(req, res) {
	var deal = new Deal(req.body);
	deal.user = req.user;
	////console.log('Chaddeal %o', deal);

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

//Get TOTAL MRC Sold by OFfice
exports.getDealMRCTotal = function(req, res){
		Deal.aggregate([ {
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

//Get Total MRC Sold by Rep
exports.getDealMRCRep = function(req, res){
	////console.log('Getting MRC'); 

	//////console.log('Request: ',req);
	//////console.log('N=?? :',req.body.n);
var n = 1;
	switch(n)
	{
		case 1:
		////console.log('Assigned Rep: ', req.assignedRep);
		//console.log('Req.User.DisplayName: ', req.user._id);

		var mytot = Deal.aggregate([ { $match: {user: req.user._id} }, {
		'$group': { 
			_id: '$user',
			total: {
				'$sum': '$mrc'
					}
				}
			}]);
			break;

		case 2:
		var mytot = Deal.aggregate([ {
		'$group': { 
			_id: '$mrc',
			total: {
				'$sum': '$mrc'
					}
				}
			}]);
			break;
	}



	mytot.exec(function(err, results) {
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
	////console.log('got to Count Deals FIND USER %o', req.user);

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	var n = 2;
	switch(n)
	{
		case 1:
		var myQuery = Deal.aggregate([  { $match: {assignedRep:req.user.displayName} },
	{
		'$group': { 
			_id: '$stage',
			total: {
				'$sum': 1
			}
		}
	}]);
		break;

		case 2:
		var myQuery = Deal.aggregate([  
	{
		'$group': { 
			_id: '$stage',
			total: {
				'$sum': 1
			}
		}
	}]);
		break;
	}


	myQuery.exec(function(err, results) {
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

//Count Deals by Rep
//Count Total Deals
exports.getDealsbyRep = function(req, res) {
	////console.log('got to Count Deals FIND USER %o', req.user);

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	var n = 1;
	switch(n)
	{
		case 1:
		var myQuery = Deal.aggregate([  { $match: {user:req.user._id} },
	{
		'$group': { 
			_id: '$stage',
			total: {
				'$sum': 1
			}
		}
	}]);
		break;

		case 2:
		var myQuery = Deal.aggregate([  
	{
		'$group': { 
			_id: '$stage',
			total: {
				'$sum': 1
			}
		}
	}]);
		break;
	}


	myQuery.exec(function(err, results) {
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
			//////console.log('leads %o',leads);
			res.jsonp(deals);
		}
	});
};

//approve a deal
exports.approveDeal = function(req, res) {
		////console.log('Deal Data: %o',req.deal);
			if(req.deal.loa_signed!='YES'){
				res.jsonp(req.deal);
			}else{
				res.send('200', 'LOAs Signed Already');
			}

			
	
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
	////console.log('Deal Start',deal);
	deal = _.extend(deal , req.body);
	////console.log('Deal Extended',deal);
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
	var id = req.deal._id;
	var signDate = req.deal.signDate;

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
	doc.image('sigcert.png', 255, 660);  
	//var bg = doc.image('LOCALLOA.png', 0, 0,{width: 600});
	var bg2 = doc.image('LDLOA.png', 0, 0,{width: 600});
	//var bg = doc.image('FCTicket.jpg', 0, 0, 600, 800);

		//Set Email
		doc.y = 644;
		doc.x = 270;
		doc.fontSize(9);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(req.deal.contactemail);

		//Set IP Address
		doc.y = 652;
		doc.x = 270;
		doc.fontSize(9);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('@ '+ip);


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

		if(req.deal.lineDetails.length > 0){


		//Set BTN
		doc.y = 325;
		doc.x = 275;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.lineDetails[0].number);

		//Set Additional Lines
		//Set X Start & Y Start Values
		var xs = 100;
		var ys = 355;
		var i =0;


		//////console.log('LineDetails #:', req.deal.lineDetails.length);
		

			//////console.log('This account has numbers online');
		
		req.deal.lineDetails.forEach(function(num){
		//////console.log('num.number',num.number);
		// ////console.log(i);
		// ////console.log('XS: '+xs+' and YS: '+ys);
		if(num!=null && i>0){
			//////console.log('num.number is here: ',num.number);

		doc.y = ys;
		doc.x = xs;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(num.number);


		
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
		i++;
	}else{
				i++;
			}
			
		});
	}else{
		////console.log('Sorry no numbers inputted');
		////console.log('Length',req.deal.lineDetails);
		////console.log('Length',req.deal.lineDetails.length);
	}


		//Set Signature
		doc.y = 635;
		doc.x = 97;
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
		doc.x = 117;
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
		doc.image('sigcert.png', 235, 685);  
		var bg = doc.image('LOCALLOA.png', 0, 0,{width: 600});
		//var bg = doc.image('LDLOA.png', 0, 0,{width: 600});
		//var bg = doc.image('FCTicket.jpg', 0, 0, 600, 800);

		//Set Email
		doc.y = 667;
		doc.x = 240;
		doc.fontSize(9);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(req.deal.contactemail);

		//Set IP Address
		doc.y = 675;
		doc.x = 240;
		doc.fontSize(9);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text('from: '+ip);

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

		if(req.deal.lineDetails.length > 0){
		//Set BTN
		doc.y = 325;
		doc.x = 275;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.lineDetails[0].number);

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

		
			////console.log('Got numbers ', req.deal.lineDetails);

			req.deal.lineDetails.forEach(function(num){
				////console.log('I: ',i);
			if(num!=null && i > 0){


				// ////console.log('hello',num.number);
				// ////console.log(i);
				// ////console.log('XS: '+xs+' and YS: '+ys);

				doc.y = ys;
				doc.x = xs;
				doc.fontSize(14);
				doc.font('Times-Roman');
				doc.text(num.number);


				
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
				i++;

			}else{
				i++;
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
		doc.x = 95;
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
		doc.x = 115;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.fillColor('black');
		doc.text(req.deal.contactname);
		doc.image('sigcert.png', 675, 200);

		//Set Title
		doc.y = 690;
		doc.x = 407;
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
	//////console.log('chunk:', chunk.length);
});
 

// buffers.push.bind(buffers));

doc.end();



// doc.on('end', function(){
// 		////console.log('doc.on end');
// 		var test = res.toString('base64');

		

		// function (err, data){
		// 	////console.log('Sending Email');
		// 	var myPDF = data.toString('base64');

		//res.setHeader('Content-disposition', 'attachment; filename=test');

		// //var test = new Buffer(data, 'base64');
		// var test = data.toString('base64');

doc.on('end', function(){
	//////console.log(callback);
	//////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

	//var content = fs.readFileSync(myfileName, 'base64');

		var message = {
	'html': '<p>Centurylink Signed LOAs:</p>',
	'text': 'Centurylink Return Email',
	'subject': 'Centurylink Signed LOAs',
	'from_email': 'yourrep@centurylink.net',
	'from_name': 'Signed LOA on Behalf of Centurylink',
	'to': [{
		'email': req.deal.contactemail,
		'name': req.deal.contactname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'cseemo@gmail.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.deal.contactemail,
			'vars': [{
					'name': 'company',
					'content': req.deal.companyname
				},
				{
					'name': 'signdate',
					'content': req.deal.signDate
				},
				{
					'name': 'signip',
					'content': ip
				},
						{
					'name': 'repname',
					'content': req.deal.assignedRep
				},
				{
					'name': 'repemail',
					'content': req.user.email
				},
				{
					'name': 'repphone',
					'content': req.user.telephone
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
		'type': 'application/pdf; name=Centurylink_Signed_LOAs.pdf',
		'name': 'Centurylink_Signed_LOAs.pdf',
		'content': content
	}]
};



var template_name='signed-loa';

var async = false;
if(timesrun < 2){

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){
	timesrun++;
	////console.log('Results from Mandrill', result);
},
function(e){
	////console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


}

});
		
	return;
	
};


//Send Order Packet

exports.sendOrderPacket = function(req, res){

	//console.log('Sending Order Packet');
	var timesrun = 0;
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	////console.log('REQ Deal', req.deal);
	var id = req.deal._id;
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var doc = new PDFDocument();
	var buffers = [];
	var myfileName = 'OrderPacket'+req.deal._id+'.pdf';
	//doc.pipe( fs.createWriteStream(myfileName) ); 
	var chunks = [];
	//FILL OUT LD LOA
	var bg2 = doc.image('LDLOA.png', 0, 0,{width: 600});
	//var bg = doc.image('FCTicket.jpg', 0, 0, 600, 800);

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

		if(req.deal.lineDetails.length > 0){


		//Set BTN
		doc.y = 325;
		doc.x = 275;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.lineDetails[0].number);

		//Set Additional Lines
		//Set X Start & Y Start Values
		var xs = 100;
		var ys = 355;
		var i =0;


		//////console.log('LineDetails #:', req.deal.lineDetails.length);
		

			//////console.log('This account has numbers online');
		
		req.deal.lineDetails.forEach(function(num){
		//////console.log('num.number',num.number);
		// ////console.log(i);
		// ////console.log('XS: '+xs+' and YS: '+ys);
		if(num!=null && i>0){
			//////console.log('num.number is here: ',num.number);

		doc.y = ys;
		doc.x = xs;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(num.number);


		
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
		i++;
	}else{
				i++;
			}
			
		});
	}else{
		////console.log('Sorry no numbers inputted');
		////console.log('Length',req.deal.lineDetails);
		////console.log('Length',req.deal.lineDetails.length);
	}



		doc.addPage();

		//FILL OUT LOCAL LOA
		
		var bg = doc.image('LOCALLOA.png', 0, 0,{width: 600});
		
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

		if(req.deal.lineDetails.length > 0){
		//Set BTN
		doc.y = 325;
		doc.x = 275;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.text(req.deal.lineDetails[0].number);

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

		
			////console.log('Got numbers ', req.deal.lineDetails);

			req.deal.lineDetails.forEach(function(num){
				////console.log('I: ',i);
			if(num!=null && i > 0){


				// ////console.log('hello',num.number);
				// ////console.log(i);
				// ////console.log('XS: '+xs+' and YS: '+ys);

				doc.y = ys;
				doc.x = xs;
				doc.fontSize(14);
				doc.font('Times-Roman');
				doc.text(num.number);


				
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
				i++;

			}else{
				i++;
			}
			
		});
	}



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
	//////console.log('chunk:', chunk.length);
});
 

// buffers.push.bind(buffers));

doc.end();


doc.on('end', function(){
	//////console.log(callback);
	//////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

	//var content = fs.readFileSync(myfileName, 'base64');

		var message = {
	'html': '<p>Centurylink Order Packet</p>',
	'text': 'Centurylink Return Email',
	'subject': 'Centurylink Order Packet',
	'from_email': 'yourrep@centurylink.net',
	'from_name': 'New Order Packet on Behalf of Centurylink',
	'to': [{
		'email': req.deal.contactemail,
		'name': req.deal.contactname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'cseemo@gmail.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.deal.contactemail,
			'vars': [{
					'name': 'company',
					'content': req.deal.companyname
				},
				{
					'name': 'repname',
					'content': req.deal.assignedRep
				},
				{
					'name': 'repemail',
					'content': req.user.email
				},
				{
					'name': 'repphone',
					'content': req.user.telephone
				},
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'dealid',
					'content': req.deal._id
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
		'type': 'application/pdf; name=Centurylink_Signed_LOAs.pdf',
		'name': 'Centurylink_Signed_LOAs.pdf',
		'content': content
	}]
};



var template_name='order-packet';

var async = false;
if(timesrun < 2){

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){
	timesrun++;
	//console.log('Results from Mandrill', result);
},
function(e){
	////console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


}

});
		
	return;
	
};


