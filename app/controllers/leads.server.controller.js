'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Lead = mongoose.model('Lead'),
	Call = mongoose.model('Call'),
	Deal = mongoose.model('Deal'),
	_ = require('lodash'),
	mandrill = require('mandrill-api/mandrill');


var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Article already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

exports.sendQuote = function(req, res){

		/* I'm sure there is a better way to do this like foreach or whatever  but we'll grab our variables here */
	var dslspeed = req.lead.dslspeed;
	var dsl = req.lead.dsl;
	var adl = req.lead.adl;
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
	var nrcs = req.lead.waivenrcs; 
	var credits = req.lead.winbackcredits;
	var term = req.lead.term;
	var staticip = req.lead.staticip;
	var modem = req.lead.modem;
	var adlPrice;

var adlcostN;
var adlPrice;
//console.log(dsl);
//Figure out Adl Lines 
if(isNaN(adl)){
adlPrice = 0;
//console.log('isNan :(');
}else{

var adlEach;
if(adl>2){
var price = 50;
var totadl = parseInt(adl)-2;
var totAdlPrice = 35*parseInt(totadl);

adlPrice = (parseInt(totAdlPrice)+parseInt(price)).toFixed(2);
adlEach = (adlPrice/adl).toFixed(2);
console.log('Each Additional Line is '+adlEach+' because you have '+adl+' adl lines and a total of $'+adlPrice);
}else{
adlPrice = (parseInt(adl)*25).toFixed(2);
adlEach = (adlPrice/adl).toFixed(2);
console.log('Each Additional Line is '+adlEach+' because you have '+adl+' adl lines and a total of $'+adlPrice);

}
}


console.log('term: '+term + ' '+'DSl.Name: '+dsl+' or the other '+dslspeed);
var dslPrice;

if(term==='1'){
	dslPrice = parseInt(105);

}else if(term==='2'){
	dslPrice = parseInt(95);

}else if(term==='3'){
	dslPrice = parseInt(85);

}

if(term==='1' && dsl==='40.5'){
	dslPrice = parseInt(135);

}

if(term==='2' && dsl==='40.5'){
	dslPrice = parseInt(125);

}

if(term==='3' && dsl==='40.5'){
	dslPrice = parseInt(115);

}

if(term==='1' && dsl==='40.20'){
	dslPrice = parseInt(145);

}

if(term==='2' && dsl==='40.20'){
	dslPrice = parseInt(135);

}

if(term==='3' && dsl==='40.20'){
	dslPrice = parseInt(125);

}
if(term==='1' && dsl==='60.30'){
	dslPrice = parseInt(399);

}

if(term==='2' && dsl==='60.30'){
	dslPrice = parseInt(409);

}

if(term==='3' && dsl==='60.30'){
	dslPrice = parseInt(419);

}
if(term==='1' && dsl==='80.40'){
	dslPrice = parseInt(499);

}

if(term==='2' && dsl==='80.40'){
	dslPrice = parseInt(509);

}

if(term==='3' && dsl==='80.40'){
	dslPrice = parseInt(519);

}
if(term==='1' && dsl==='100.12'){
	dslPrice = parseInt(375);

}

if(term==='2' && dsl==='100.12'){
	dslPrice = parseInt(385);

}

if(term==='3' && dsl==='100.12'){
	dslPrice = parseInt(395);

}

var staticIP = 0;
var staticiptype = null
if(staticip==='Static'){
staticIP=5.95;
staticiptype = 'Single Static IP Address';
}
if(staticip==='StaticBlock'){
staticIP=14.95;

staticiptype = 'Block of 8 Static IP Addresses';
}

//console.log('Static'+staticIP);



var modemCostM = 0;
var modemCostN = 0;
var modemtext;
if(modem==='Lease'){
modemCostM = parseFloat(6.95,2);
modemtext = 'Leasing New DSL Modem';
}
if(modem==='Purchase'){
modemCostN = parseFloat(99,2);
modemtext = 'Purchasing New DSL Modem';
}

//console.log('Modem'+modem.name);
var dslnrc;
var nrcoutput;
var adlnrc;
var adlcostN;
if(nrcs==='Yes'){
	adlcostN=0;
	dslnrc = 0;
	nrcoutput = 'WAIVED';
	adlnrc=0.00;
}else{
	//$99 for DSL
	adlnrc = (parseInt(adl*42.5)).toFixed(2);
adlcostN = 99+adlnrc;
adlcostN = parseFloat(adlcostN, 2); 
dslnrc = 99.00;
nrcoutput = '$'+req.lead.nrc;
}


//console.log('DSL '+dslPrice);

var staticIPcost = staticIP.toFixed(2);
var currentPrice = parseInt(dslPrice)+parseInt(adlPrice)+parseFloat(staticIPcost)+modemCostM;

////console.log('NRR Stuff: '+adlcostN+' -- Modem: '+modemCostN);


var nrrCost = parseInt(adlcostN)+parseFloat(modemCostN);


	console.log('Request Body Info',req.body);
	//console.log('Rep Info '+req.body.repname+' -- '+req.body.repphone+' -- '+req.body.repemail)
	console.log('Request Lead Info',req.lead);
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var doc = new PDFDocument();
	var timesrun = 0;
	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'Quote'+req.lead._id+'.pdf';
	//doc.pipe( fs.createWriteStream(myfileName) );
	var date = new Date(Date.now());
	var d = date.getDate();
	var m = date.getMonth()+1;
	var y = date.getYear()-100;

	//Get Credit Difference
	if(req.lead.winbackcredits>0){
		console.log('Winback Credits: '+req.lead.winbackcredits);
	var promoMRC = (req.lead.mrc-(req.lead.winbackcredits/10)).toFixed(2);
	var actMRR = req.lead.mrc;

		console.log('Difference : '+actMRR);
}else{
	promoMRC = req.lead.mrc;
	actMRR = req.lead.mrc;
}

	console.log('Date = '+m+'/'+d+'/'+y+' - is it right?');
	//console.log('Date '+date+' m='+m+'.... d='+d)+'...y='+year);
	var quoteDate = m+'/'+d+'/'+y;
	// console.log('Quote Date: ',quoteDate);
	var chunks = [];
	
	var header = doc.image('Header.png', 0, 0,{width: 620});
	

	
	doc.on('data', function(chunk){
	chunks.push(chunk);
	////console.log('chunk:', chunk.length);
});

		
	

		//Set Company Name
		// doc.y = 80;
		// // doc.x = 250;
		// doc.fontSize(24);
		// doc.font('Times-Roman');
		// doc.fillColor('green')
		// doc.text(req.lead.companyname,{
		// 	align: 'center'
		// });


	//var deal = req.deal;
	////console.log('Request::::::',req);
	////console.log('Look above here for the email address and shit');
	////console.log('Request EMail',req.email);


		
		//Footer Info 
		var footer = doc.image('Footer.png', 0, 648,{width: 620});

		doc.y = 655;
		var newy = doc.y;
		doc.x = 45;
		doc.fontSize(14);
		doc.font('Times-Roman');
		doc.fillColor('white')
		doc.text(req.user.firstName+' '+req.user.lastName,{
			align: 'left'
		});
		//doc.moveDown();
		doc.text('Sr. Account Manager');
		doc.text(req.user.telephone);
		doc.text(req.user.email);

			//Set Company Name
		// if(req.lead.companyname.length<)
		doc.y = 80;
		doc.x = 70;
		doc.fontSize(26);
		doc.font('Times-Roman');
		doc.fillColor('#008643')
		doc.text(req.lead.companyname,{
			align: 'center'
		});
	
		//Set Quote Date
		doc.y = 115;
		doc.x = 375;
		doc.fontSize(12)
		doc.fillColor('black')
		doc.text('Prepared Date:  '+quoteDate,{
			width: 200,
			align: 'left'
		});
		//Set Prepared for Data
		doc.y = 115;
		doc.x = 55;
		doc.fontSize(12)
		doc.fillColor('black')
		doc.text('Prepared For:  '+req.lead.contactname,{
			width: 200,
			align: 'left'
		});
		doc.fontSize(12);
		doc.text('Telephone:  '+req.lead.telephone,{
			width: 200,
			align: 'left'
		});

		doc.fontSize(12);
		doc.text('Email:  '+req.lead.email,{
			width: 200,
			align: 'left'
		});

		//Set Quote Content Header 
		var grad = doc.linearGradient(0, 100, 520, 200)
		grad.stop(0, '#008643')
			.stop(1, '#8BC53F')
		// doc.rotate(90, {origin: [45, 175]})
		doc.rect(45, 175, 520, 20)
		doc.fill(grad);

		// doc.lineWidth(25)
		// doc.strokeColor('#008643')
		// doc.lineCap('butt')
		// .moveTo(45,180)
		// .lineTo(555,180)
		// .stroke();

		//Set Content Header Info
		//Column 1 Quantity
		doc.y = 180;
		doc.x = 50;
		doc.fontSize(12)
		doc.fillColor('white')
		doc.text('Quantity',{
			align: 'left',
			lineBreak: false,
			continued: true
		});

		// doc.y = 180;
		doc.x = doc.x-1+16;
		// doc.fontSize(12)
		doc.fillColor('white')
		doc.text('Description',{
			align: 'left',
			lineBreak: false,
			continued: true
		});

		// doc.y = 180;
		doc.x = doc.x-1+116;
		// doc.fontSize(12)
		doc.fillColor('white')
		doc.text('Per Unit Monthly',{
			align: 'left',
			lineBreak: false,
			continued: true
		});

		// doc.y = 180;
		doc.x = doc.x-1+21;
		// doc.fontSize(12)
		doc.fillColor('white')
		doc.text('Total One-Time',{
			align: 'left',
			lineBreak: false,
			continued: true
		});

		// doc.y = 180;
		doc.x = doc.x-1+21;
		// doc.fontSize(12)
		doc.fillColor('white')
		doc.text('Total Monthly',{
			align: 'left',
			lineBreak: false,
			continued: true
		});


		//Set Content
		//First Batch
		doc.y = 200;
		doc.x = 60;
		doc.fontSize(12)
		doc.fillColor('black')
		doc.text('1',{
			align: 'left',
			lineBreak: false
		});

		// doc.y = 180;
		doc.x = 80;
		// doc.fontSize(12)
		doc.fillColor('black')
		doc.text('Core Connect Package',{
			width: 180,
			align: 'left'
		});

		//Monthly Per Unit Price of Batch 1
		doc.x = 300;
		doc.y = 200;
		doc.text('$'+dslPrice.toFixed(2),{
			align: 'left'
		});

		//One-Time Per Unit Price of Batch 1
		doc.x = 400;
		doc.y = 200;
		doc.text('$'+dslnrc.toFixed(2),{
			align: 'left'
		});

		//Monthly Total of Batch 1
		doc.x = 500;
		doc.y = 200;
		doc.text('$'+dslPrice.toFixed(2),{
			align: 'left'
		});

		//DSL SPeed
		// doc.y = 180;
		newy = doc.y;
		// doc.y = 180;
		doc.x = 80;
		// doc.fontSize(12)
		doc.fillColor('black')
		doc.text('- Includes '+dsl+' Fiber-Optic DSL and 1 Phone Line w/ Unlimited Long Distance',{
			width: 500,
			align: 'left'
		});
		doc.x = 80;
		// doc.fontSize(12)
		doc.fillColor('black')
		doc.text('- 30 Day Satisfaction Guarantee',{
			width: 500,
			align: 'left'
		});
		doc.x = 80;
		// doc.fontSize(12)
		doc.fillColor('black')
		doc.text('- Fiber-Optic High Speed Internet means a consistently fast and reliable connection',{
			width: 500,
			align: 'left'
		});
		newy = doc.y;
		
		// doc.x = 80;
		// // doc.fontSize(12)
		// doc.fillColor('black')
		// doc.text('Fiber-Optic High Speed Internet ('+dsl+')',{
		// 	width: 180,
		// 	align: 'left'
		// });
		// newy = doc.y;

		//Static IP Details
		if(staticiptype!=null){
		doc.x = 80;
		doc.y = newy;
		doc.text(staticiptype,{
			
			align: 'left',
			lineBreak: false
		});	
			
		doc.x = 300;
		doc.y = newy;
		doc.text('$'+staticIP,{
		
			align: 'left',
			
		});	
			doc.x = 500;
			doc.y = newy;
		doc.text('$'+staticIP,{
		
			align: 'left',
			
		});	

		}

		//DSL Modem Details
		if(modem!='None'){
			doc.x = 80;
			newy = doc.y;
			doc.text(modemtext,{
			align: 'left'
			});	

			if(modem==='Lease'){
				//DSL Modem Lease
				doc.x = 300;
				doc.y = newy;
				doc.text('$'+modemCostM.toFixed(2),{
				align: 'left',
				});	

				doc.x = 500;
				doc.y = newy;
				doc.text('$'+modemCostM.toFixed(2),{
				align: 'left',
				});	
			}

			//IF DSL is PURCHASE
			if(modem==='Purchase'){
				doc.x = 400;
				doc.y = newy;
				doc.text('$'+modemCostN.toFixed(2),{
				align: 'left',
				});	
			}
		}

		// doc.fillColor('black')
		// doc.text('Details akdjflasjdflkajsdflkjs aasdfasdfklaskjdfkl asjdfkldfkljasdl fkjasdkflja sdlk fja sldkfj',{
		// 	width: 480,
		// 	align: 'left'
		// });
		// doc.fillColor('black')
		// doc.text('More and More Details kdjflasj dflkajs flkjsaas dfasdfklas kjdfklasjd fkldfk  ljasdlfkjasdkfl jasd lkfj as ldkfj',{
		// 	width: 480,
		// 	align: 'left'
		// });
		var highy = doc.y;

		//Second Batch
		if(adl!=0){
		doc.y = highy-1+21;
		doc.x = 60;
		newy = doc.y;
		doc.fontSize(12)
		doc.fillColor('black')
		doc.text(adl,{
			align: 'left',
			lineBreak: false
		});

		// doc.y = 180;
		doc.x = 80;
		doc.y = newy;
		// doc.fontSize(12)
		doc.fillColor('black')
		doc.text('Additional Telephone Lines',{
			width: 180,
			align: 'left',
			lineBreak: false
		});

		doc.fillColor('black')
		doc.text('- Unlimited Local & Long Distance Calling',{
			width: 480,
			align: 'left'
		});
		doc.fillColor('black')
		doc.text('- Includes 15 Free Features',{
			width: 480,
			align: 'left'
		});
		doc.text('- Voicemail, Caller ID, Call Waiting, Call Forwarding, Three-Way Calling, Call Transfer, Etc.',{
			width: 480,
			align: 'left'
		});
		highy = doc.y;

		//Set PRice
		doc.x = 300;
		doc.y = newy;
		doc.text('$'+adlEach,{
			align: 'left'
		});

		doc.x = 400;
		doc.y = newy;
		doc.text('$'+adlnrc,{
			align: 'left'
		});

		doc.x = 500;
		doc.y = newy;
		doc.text('$'+adlPrice,{
			align: 'left'
		});
	}

		//Third Batch
		newy = highy-1+20;
		doc.y = newy;
		doc.x = 60;
		doc.fontSize(12)
		doc.fillColor('black')
		doc.text('1',{
			align: 'left',
			lineBreak: false
		});
		doc.x = 500;
		doc.y = newy;
		doc.text('INCLUDED',{
			align: 'left'
		});

		// doc.y = 180;
		doc.x = 80;
		doc.y = newy;
		doc.fontSize(12)
		doc.fillColor('black')
		doc.text('Web Suite & Microsoft Office 365',{
			width: 180,
			align: 'left',
			lineBreak: false
		});
		// var office365 = doc.image('office365.png', 300, newy+55,{width: 80});
		var office365 = doc.image('office365icon.png', 300, newy,{width: 150});


		doc.fontSize(12)
		doc.fillColor('black')
		doc.text('- Website, Design, and Hosting',{
			width: 480,
			align: 'left'
		});
		doc.text('- Domain Name Registration',{
			width: 480,
			align: 'left'
		});
		doc.text('- 10 Exchange Email Accounts',{
			width: 480,
			align: 'left'
		});
		doc.text('- Free Subscription to Office 365',{
			width: 480,
			align: 'left'
		});
		doc.text('- Search Engine Submission',{
			width: 480,
			align: 'left'
		});
		doc.text('- Free Data Backup (Up to 250GB)',{
			width: 480,
			align: 'left'
		});
		// doc.fillColor('black')
		// doc.text('More and More Details kdjflasj dflkajs flkjsaas dfasdfklas kjdfklasjd fkldfk  ljasdlfkjasdkfl jasd lkfj as ldkfj',{
		// 	width: 480,
		// 	align: 'left'
		// });
		highy = doc.y;

		

		//Set PRice
		// doc.x = 300;
		// doc.y = newy;
		// doc.text('INCLUDED',{
		// 	align: 'left'
		// });

		// doc.x = 410;
		// doc.y = newy;
		// doc.text('INCLUDED',{
		// 	align: 'left'
		// });

		newy = highy-1+21;
		doc.y = newy;
		doc.x = 75;
		//Set Credits Details
		if(req.lead.winbackcredits>0){
		
		
		doc.fontSize(14)
		doc.fillColor('black')
		doc.text('Credits Issued: $'+req.lead.winbackcredits+' over 10 Months',{
			align: 'left',
			lineBreak: false
		});

		}
	
		if(nrcoutput==='WAIVED'){
		doc.x = 400;
		doc.fontSize(14)
		doc.fillColor('black')
		doc.text('Activation Fees: '+nrcoutput,{
			align: 'left',
			lineBreak: false
		});
	}

		//Set Big PRice Stuff
		doc.y = doc.y-1+56;
		doc.x = 200;
		doc.fontSize(18)
		doc.text('$'+promoMRC,{
			align: 'left',
			lineBreak: false
		});
		doc.x = doc.x-1+6;
		doc.text('per month',{
			align: 'left',
			lineBreak: false
		});


		doc.x = doc.x-1+36;
		doc.fontSize(18)
		doc.text('$'+req.lead.nrc,{
			align: 'left',
			lineBreak: false
		});
		doc.x = doc.x-1+6;
		doc.text('One-Time',{
			align: 'left',
			lineBreak: false
		});

		//set Fine Print
		if(req.lead.winbackcredits>0){
		doc.y = doc.y-1+18;
		doc.x = 210;
		doc.fontSize(10)
		doc.fillColor('grey')
		doc.text('After 10 Months: $'+actMRR+'/mo',{
			align: 'center',
			lineBreak: false
		});
	}

		//Set Notices on bottom
		doc.x = 65;
		doc.y = 620;
		doc.fontSize(10)
		doc.text('Customer is acknowledging signing a '+term+' year contract - they can never get out of this and will be stuck for life, please do not blame us when you get charged TLA from your current provider',{
			align: 'center',
			width: 475
		});



doc.end();


doc.on('end', function(){
	////console.log(callback);
	////console.log('DId you get a callback?');
	var mypdf = Buffer.concat(chunks);
	//.concat(buffers);
	var content = mypdf.toString('base64');

	//var content = fs.readFileSync(myfileName, 'base64');

		var message = {
	'html': '<p>Centurylink Quote</p>',
	'text': 'Centurylink Return Email',
	'subject': 'Centurylink Quote',
	'from_email': req.user.email,
	'from_name': req.user.email,
	'to': [{
		'email': req.lead.email,
		'name': req.lead.contactname,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': req.user.email
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.lead.email,
			'vars': [{
					'name': 'company',
					'content': req.lead.companyname
				},
				{
					'name': 'phone',
					'content': req.lead.telephone
				},
				{
					'name': 'credits',
					'content': req.lead.winbackcredits
				},
				{
					'name': 'salesrep',
					'content': req.user.displayName
				},
				{
					'name': 'salesrepemail',
					'content': req.user.email
				},
				{
					'name': 'salesreptel',
					'content': req.user.telephone
				},
				{
					'name': 'signip',
					'content': ip
				}




				]
	}],
	'important': false,
	'track_opens': true,
	'track_clicks': true,
	'auto_text': null,
	'auto_html': null,
	'inline_css': null,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'tags': ['new-quote'],
	'signing_domain': null,
	'return_path_domain': null,
	'attachments': [{
		'type': 'application/pdf; name=Centurylink_Quote.pdf',
		'name': 'Centurylink_Quote.pdf',
		'content': content
	}]
};



var template_name='new_quote';

var async = false;

//SEND EMAIL

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){
	timesrun++;
	console.log('Results from Mandrill', result);
	res.message = result;
	// doc.pipe( res );
	res.send('200', mypdf);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	res.send('303 - Error Sending Email', 'Sorry an error occurred: '+ e.name + ' - ' + e.message);
});



});
		
	return;
	




};

exports.getLeadsByStatus = function(req, res) {

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	Lead.aggregate([{
		'$group': { 
			_id: '$status',
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


/*
	Check Email Stats
*/
exports.getEmailInfo = function(req, res){
//console.log('We got to get Email Details');
res.send(200,'Got that stuff!!!');


};
/*
 * Qwest loop qualification check
 */
exports.getQwestLoop = function(req, res) {
			res.send(505,'Sorry Centurylink is Not Playing Nice');

	// var request = require('request');
	// var address = req.params.address;
	// var findCookies = function(cookies) {
	// 	var cookieBuffer = '';
	// 	for(var cookie in cookies) {
			
	// 		cookieBuffer += cookies[cookie].split(';')[0] +'; ';
	// 	}
	// 	return cookieBuffer;
	// };



	// var checkAddress = function(id, cookies, callback) {

	// 	request.post({
	// 		url: 'https://shop.centurylink.com/MasterWebPortal/freeRange/smb/shopjumpin.action', 
	// 		headers: {
	// 			'Cookie': cookies + ' remember_me=addressID%7C'+id+'; profile_cookie=redirectTarget%7Chttps%3A%2F%2Fshop.centurylink.com%2Fsmall-business%2Fproducts%2Fbundles%2F~redirectTargetQ%7Chttps%3A%2F%2Fshop.centurylink.com%2FMasterWebPortal%2FfreeRange%2Fshop%2FSMBNCBundle.action%3FselectedProd%3Dcc~redirectTargetCTL%7Chttps%3A%2F%2Fshop.centurylink.com%2Fsmallbusiness%2Fproducts%2Fbundles%2Fcore-connect%2F; '
	// 		}

	// 	}, callback);
	// }

	// var b = request('https://shop.centurylink.com/small-business/', function(err, response, body) {
	// 	if(err) {
	// 		console.log('err? ', err);
	// 	}

	// 	for(var cookie in response.headers['set-cookie']) {
	// 		if(response.headers['set-cookie'][cookie].match(/TCAT_JSESSIONID/g)) {
				
	// 			var currentCookie = response.headers['set-cookie'][cookie].split(';');
	// 			for(var c in currentCookie) {
	// 				if(currentCookie[c].match(/TCAT_JSESSIONID/g)) {
						
	// 					var tcat = currentCookie[c].split('=')[1];

	// 					console.log('Session %s started\nAttempting to search for addressid: %s', tcat, address);
	// 					checkAddress(address, findCookies(response.headers['set-cookie']), function(err, response, body) {
	// 						var re = /addressid2.{9}(.*)' /g;
	// 						var matches = re.exec(body);
	// 						var awesome = function(cookies) {
	// 							request({
	// 								url: 'https://shop.centurylink.com/MasterWebPortal/freeRange/smb/SMBDisplay.action',
	// 								headers: {
	// 									'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
	// 									Referer: 'https://shop.centurylink.com/MasterWebPortal/freeRange/smb/shopjumpin.action',
	// 									'Cookie': cookies
										
	// 								}
	// 							}, function(err, response, body) {
	// 								// var results = [];
	// 								// var re = /DisplayProduct:.*Internet ([0-9\.]+)([a-zA-Z]).*[\/]([0-9]+)([a-zA-Z]).*ps/g;
	// 								// var m;
	// 							//console.log('ResponseBody ', body);
	// 								// var index = body.search('End ProductConfiguration');
	// 								// if(index > -1) {
	// 								// 	//console.log('Found index at: %d original size is: %d', index, body.length);
	// 								// 	body = body.substring(0, index);
										
	// 								// }
	// 								// while (m = re.exec(body)) {
										
	// 								// 	if (m.index === re.lastIndex) {
	// 								// 		re.lastIndex++;
	// 								// 	}
										
	// 								// 	results.push({
	// 								// 		name: m[1] + '.' + m[3],
	// 								// 		value: m[1] + m[2] + 'bps/' + m[3] + m[4] + 'bps',
	// 								// 		svalue: m[1] + m[2] + '/' + m[3] + m[4],
	// 								// 		download: m[1],
	// 								// 		downloadRate: m[2],
	// 								// 		upload: m[3],
	// 								// 		uploadRate: m[4]
	// 								// 	});
	// 								// }

	// 								// //console.log(results);
	// 								// res.send({speeds: results});
	// 								res.send(body);
	// 								return true;
	// 							});
	// 						};

	// 						if(matches) {

	// 							//console.log('Found multi unit address re-quering server for primary unit number (%s)', matches[1].split('|')[2]);
	// 							checkAddress(address+'~geoSecId%7C' + matches[1].split('|')[2], findCookies(response.headers['set-cookie']), function(err, response, body) {
	// 								awesome(response.headers['set-cookie']);
	// 							});
	// 						} else {
	// 							//console.log('no mismatch found, fetching bandwidth availability');
	// 							awesome(findCookies(response.headers['set-cookie']) + ' TCAT_JSESSIONID='+tcat+'; ');
	// 						}
	// 					});
						
	// 				}
	// 			}
	// 		}
	// 	}
	// });
};

//Test Posting our Form Data to PHP File to render PDF
exports.gogetQuote = function(req, res) {
//console.log('Coming from gogetQuote: '+req.body);
res.send({Response: 'Good'});
	};


//Create a Quote
exports.createQuote = function(req, res) {

	/* Do logic here */
    //$log.info('Params: ', req.body);
	////console.log('Params: ', req);
	//console.log(req.body.term);
	////console.log(req.params.dsl_speed);
	
	/* I'm sure there is a better way to do this like foreach or whatever  but we'll grab our variables here */
	var dsl = req.body.dsl;
	var adl = req.body.adl;
	var nrcs = req.body.nrcs; 
	var credits = req.body.credits;
	var term = req.body.term;
	var staticip = req.body.iptype;
	var modem = req.body.modem;
	var adlPrice;

var adlcostN;

//console.log(dsl);
//Figure out Adl Lines 
if(isNaN(adl)){
adlPrice = 0;
//console.log('isNan :(');
}else{


if(adl>2){
var price = 50;
var totadl = parseInt(adl)-2;
var totAdlPrice = 35*parseInt(totadl);

adlPrice = parseInt(totAdlPrice)+parseInt(price);

}else{
adlPrice = parseInt(adl)*25;
}
}


//console.log('term: '+term + ' '+'DSl.Name: '+dsl.name);
var dslPrice;

if(term.value==='1'){
	dslPrice = parseInt(105);

}else if(term.value==='2'){
	dslPrice = parseInt(95);

}else if(term.value==='3'){
	dslPrice = parseInt(85);

}

if(term.value==='1' && dsl.name==='40.5'){
	dslPrice = parseInt(135);

}

if(term.value==='2' && dsl.name==='40.5'){
	dslPrice = parseInt(125);

}

if(term.value==='3' && dsl.name==='40.5'){
	dslPrice = parseInt(115);

}

if(term.value==='1' && dsl.name==='40.20'){
	dslPrice = parseInt(145);

}

if(term.value==='2' && dsl.name==='40.20'){
	dslPrice = parseInt(135);

}

if(term.value==='3' && dsl.name==='40.20'){
	dslPrice = parseInt(125);

}
if(term.value==='1' && dsl.name==='60.30'){
	dslPrice = parseInt(399);

}

if(term.value==='2' && dsl.name==='60.30'){
	dslPrice = parseInt(409);

}

if(term.value==='3' && dsl.name==='60.30'){
	dslPrice = parseInt(419);

}
if(term.value==='1' && dsl.name==='80.40'){
	dslPrice = parseInt(499);

}

if(term.value==='2' && dsl.name==='80.40'){
	dslPrice = parseInt(509);

}

if(term.value==='3' && dsl.name==='80.40'){
	dslPrice = parseInt(519);

}
if(term.value==='1' && dsl.name==='100.12'){
	dslPrice = parseInt(375);

}

if(term.value==='2' && dsl.name==='100.12'){
	dslPrice = parseInt(385);

}

if(term.value==='3' && dsl.name==='100.12'){
	dslPrice = parseInt(395);

}



var staticIP = 0;

if(staticip.name==='Static'){
staticIP=5.95;
}
if(staticip.name==='StaticBlock'){
staticIP=14.95;
}

//console.log('Static'+staticIP);



var modemCostM = 0;
var modemCostN = 0;
var modemtext;
if(modem.name==='Lease'){
modemCostM = parseFloat(6.95,2);

}
if(modem.name==='Purchase'){
modemCostN = parseInt(99);

}

//console.log('Modem'+modem.name);

if(nrcs.name==='Yes'){
	adlcostN=0;
}else{
	//$99 for DSL
adlcostN = 99+parseInt(adl*42.5);
adlcostN = parseFloat(adlcostN, 2); 
}


//console.log('DSL '+dslPrice);

var staticIPcost = staticIP.toFixed(2);
var currentPrice = parseInt(dslPrice)+parseInt(adlPrice)+parseFloat(staticIPcost)+modemCostM;

////console.log('NRR Stuff: '+adlcostN+' -- Modem: '+modemCostN);


var nrrCost = parseInt(adlcostN)+parseFloat(modemCostN);

////console.log('NRR Cost: '+nrrCost);
////console.log('Current Price'+currentPrice);
	// Return our object to the front end
	res.send({ price: currentPrice, nrr: nrrCost });
};

// //Test this -- find a Deal w/ NO AssignedRep in 
// exports.oldestFirst = function(req, res) { 
// 	//var mytemplate = "{assignedRep: null, state: {$in: ['MN', 'NM']}}";
// 	var states = ['IA', 'MN', 'AZ'];
// 	var carrier = 'Integra';
// 	var dispos = ['Proposed', 'Follow-Up', 'Call Back', 'Lead'];
// 	// , state: {$in: states}, status: {$in: dispos}
// 	var query = Lead.where({assignedRep: null, state: {$in: states}, currentCarrier: {$regex: '^'+carrier+'.*', $options: 'i'}});
// 	query.findOne(function (err, lead) {
// 		if (err) return res.status(400).send({
// 				message: 'Error Getting Leads - exports.OldestFirst'
// 			});
// 		if (lead) {
// 			//console.log('lead',lead);
// 			//console.log('req.user', req.user);
// 			lead.user = req.user;
// 			lead.assigned = Date.now();
// 			lead.assignedRep = req.user.displayName;
// 			lead.save(function(err) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: getErrorMessage(err)
// 			});
// 		} else {
// 			////console.log('Lead to Be Sent %o', lead);
// 			res.jsonp(lead);
// 		}

// 			});






// 		}
// 		// 	, state: {$in: states}}).sort('assigned').exec(function(err, lead) {
// 		// 	if (err) {
// 		// 	return res.status(400).send({
// 		// 		message: 'Error Getting Leads - exports.OldestFirst'
// 		// 	});
// 		// } else {
		
			
			
// 			});
// 		};


//Get Oldest Lead
exports.oldestFirst = function(req, res) { Lead.findOne({assignedRep: null}).exec(function(err, lead) {
			if (err) {
			return res.status(400).send({
				message: 'Error Getting Leads - exports.OldestFirst'
			});
		} else {
			lead.user = req.user;
			lead.assignedRep = req.user.displayName;
			lead.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			////console.log('Lead to Be Sent %o', lead);
			res.jsonp(lead);
		}

			});
			}
		});
};


exports.createDeal = function(req, res) {
	var deal = new Deal(req.body);
	//console.log('CreateDeal: %o', deal);
	//console.log('User Req', req.user);
	deal.user = req.user;

	deal.save(function(err, callback) {
		if (err) {
			//console.log('Error!! %o', err);
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			//console.log('createDeal Passing: %o',callback);
			res.jsonp(deal);
		}
	});
};



exports.create = function(req, res) {
	var lead = new Lead(req.body);
	//console.log(lead);
	lead.user = req.user;

	lead.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(lead);
		}
	});
};

//Get Pie Chart Data for Leads Screen
exports.getLeadData = function(req, res) {

var mystuff = ['15','23','30'];
//console.log('mystuff %o',mystuff);
	res.jsonp(mystuff);


};


exports.showDeal = function(req, res) {
		//console.log('Deal Data: %o',req.deal);

			res.jsonp(req.deal);
	
};

/**
 * Show the current Lead
 */
exports.read = function(req, res) {
		////console.log('Lead Data: %o',req.lead);
////console.log('User Data: %o',req.user);

	if(req.lead.user===null){
		////console.log('USER NULL !!!!  %o',req.user);

	req.lead.user = req.user;
	req.lead.assignedRep = req.user.displayName;
	}
	////console.log('Lead Data: %o',lead);
	req.lead.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			////console.log('Lead Data: %o',req.lead);
			res.jsonp(req.lead);
		}
	});
};



/**
 * Update a Lead
 */
exports.update = function(req, res) {


	var lead = req.lead ;
////console.log('Lead %o',lead);
////console.log('REQ',req);
lead = _.extend(lead , req.body);

	lead.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(lead);
		}
	});
};

/**
 * Update a Deal
 */
exports.updateDeal = function(req, res) {
//console.log('REQ.deal %o',req.deal);

	var deal = req.deal ;
////console.log('Lead %o',lead);
////console.log('REQ',req);
deal = _.extend(deal , req.body);

	deal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(deal);
		}
	});
};



/**
 * Delete an Lead
 */
exports.delete = function(req, res) {
	var lead = req.lead ;

	lead.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(lead);
		}
	});
};

//Get Follow-Ups/Proposals
exports.getFLUP = function(req, res) { Lead.find({$or: [ 
	{status: 'Follow-Up'},
	{status: 'Proposed'}

	]}).where({user: req.user.id}).sort('FLUPDate').limit(50).exec(function(err, leads) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			////console.log('leads %o',leads);
			res.jsonp(leads);
		}
	});
};

//Get Leads by Carrier
//getLeadsByState
exports.getLeadsByCarrier = function(req, res) {
	//console.log('got to getLeadsByCarrier');

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	Lead.aggregate([ { $match: {assignedRep:req.user.displayName} }, {
		'$group': { 
			_id: '$currentCarrier',
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

//get telephone calls
exports.getCallsbyRep = function(req, res) {
	//console.log('got to Cals By Rep');
	//console.log('Req.USer',req.user.displayName);
		//console.log('What is n? req.body: ',req)

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	Lead.aggregate([ 
	{	$project : { 'callDetails' : 1 } },
	{	$unwind  : '$callDetails'},
	{	$group 	 : 
		{
			_id: '$callDetails.rep',
			total: {
				'$sum': 1
			}
			
			
		}

	}

	]).exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			//console.log('Rresuls????????? %o',results);
			// var total = 0;
			// Object.keys(results).forEach(function(key) {
			// 	//console.log(results[key]);
			// 	calltime = results[key].calltime;
			// 	results.push({_id: 'Call', 'calltime': calltime});
			// });
			//results.push({_id: 'total', 'total': total});
			res.jsonp(results);
		}
	});	
};

//getLeadsByState REP LEVEL
exports.getLeadsByState = function(req, res) {
	//console.log('got to getLeadsByState');

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	Lead.aggregate([ { $match: {assignedRep:req.user.displayName} }, {
		'$group': { 
			_id: '$state',
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

//getLeadsByState ADMIN LEVEL
exports.getAllLeadsByState = function(req, res) {
	//console.log('got to getLeadsByState');

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	Lead.aggregate([{
		'$group': { 
			_id: '$state',
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

//Get ALL LEADS by STATUS
exports.getAllLeadsByStatus = function(req, res) {
	//console.log('got to getLeadsByStatus');

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	Lead.aggregate([{
		'$group': { 
			_id: '$status',
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
			console.log('ALL Leads BY STATUS',results);
		}
	});	
};

//getLeadsByStatus for REP
exports.getLeadsByStatus = function(req, res) {
	//console.log('got to getLeadsByStatus');

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	Lead.aggregate([ { $match: {user :req.user._id} }, {
		'$group': { 
			_id: '$status',
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
			console.log('Rep Leads BY STATUS',results);
		}
	});	
};

//Count Total Leads
exports.getLeadsbyTotal = function(req, res) {
	console.log('got to Count Deals FIND USER %o', req.user);

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	var n = 2;
	switch(n)
	{
		case 1:
		var myQuery = Lead.aggregate([  { $match: {assignedRep:req.user.displayName} },
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
		var myQuery = Lead.aggregate([  
		{
			'$match': {
				assignedRep: null
			}
		},
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

//Count Leads by REP
exports.getLeadsbyRep= function(req, res) {
	console.log('got to Count Deals FIND USER %o', req.user);

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	var n = 1;
	switch(n)
	{
		case 1:
		var myQuery = Lead.aggregate([  { $match: {user:req.user._id} },
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
		var myQuery = Lead.aggregate([  
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
exports.getDEALS = function(req, res) { Deal.find().where({assignedRep: req.user.displayName}).sort('-updated').limit(50).exec(function(err, deals) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			//console.log('getDeals: ', deals);
			////console.log('leads %o',leads);
			res.jsonp(deals);
		}
	});
};


/**
 * List of Leads
 */
 //OLD Way where we want NEW leads/our leads ONLY
// exports.list = function(req, res) { Lead.find({$or: [ 
// 	{user: req.user.id},
// 	{assignedRep: null}

//This way we get ALL Leads for our data
	exports.list = function(req, res) { Lead.find().sort('-lastCalled').exec(function(err, leads) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			////console.log('leads %o',leads);
			res.jsonp(leads);
		}
	});
};

exports.listdeals = function(req, res) { Deal.find().sort('-converted').limit(500).exec(function(err, deals) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			////console.log('leads %o',leads);
			res.jsonp(deals);
		}
	});
};



exports.listbyRep = function(req, res) { Lead.find({user: req.user.id}).sort('-lastCalled').populate('user', 'displayName').exec(function(err, leads) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(leads);
		}
	});
};


exports.dealByID = function(req, res, next, id) { Deal.findById(id).populate('user', 'displayName').exec(function(err, deal) {
		if (err) return next(err);
		if (! deal) return next(new Error('Failed to load Deal ' + id));
		req.deal = deal ;
		next();
	});
};


/**
 * Lead middleware
 */
exports.leadByID = function(req, res, next, id) { Lead.findById(id).populate('user').exec(function(err, lead) {
		if (err) return next(err);
		if (! lead) return next(new Error('Failed to load Lead ' + id));
		req.lead = lead ;
		next();
	});
};

/**
 * Lead authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.lead.user.id !== req.user.id){
		return res.status(403).send('User is not authorized');
	}
	next();
};