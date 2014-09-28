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
	//var deal = req.deal;
	////console.log('Request::::::',req);
	////console.log('Look above here for the email address and shit');
	////console.log('Request EMail',req.email);
	//console.log('Request Lead Info',req.lead);
	var PDFDocument = require('pdfkit');
	var fs=require('fs');
	var doc = new PDFDocument();
	var timesrun = 0;
	//var stream = doc.pipe(blobStream());
	var buffers = [];
	var myfileName = 'Quote'+req.lead._id+'.pdf';
	//doc.pipe( fs.createWriteStream(myfileName) );
	 
	var chunks = [];
	//FILL OUT LD LOA
	doc.image('sigcert.png', 255, 660);  
	//var bg = doc.image('LOCALLOA.png', 0, 0,{width: 600});
	var bg2 = doc.image('Header.png', 0, 0,{width: 620});
	//var bg = doc.image('FCTicket.jpg', 0, 0, 600, 800);

	doc.pipe( res );

	doc.on('data', function(chunk){
	chunks.push(chunk);
	////console.log('chunk:', chunk.length);
});
 

 	// mylead: myleadT,
		// 	term: this.term.value,
		// 	dslspeed: this.dsl.svalue,
		// 	adllines: this.adl,
		// 	full_name: this.dmname,
		// 	phone: this.tel,
		// 	email: this.email, 
		// 	companyname: this.coname, 
		// 	modem: this.modem.value,
		// 	nrc: this.nrcs.value,
		// 	credits: this.credits.name,
		// 	staticIP: this.iptype.name,
		// 	sndloas: 0,
		// 	address: lead.address,
		// 	city: lead.city,
		// 	state: lead.state,
		// 	zip: lead.zipcode


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
	'from_email': 'yourrep@centurylink.net',
	'from_name': req.user.email,
	'to': [{
		'email': req.lead.email,
		'name': req.lead.contactname,
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
					'content': '505-555-1111'
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
		'type': 'application/pdf; name=Centurylink_Signed_LOAs.pdf',
		'name': 'Centurylink_Signed_LOAs.pdf',
		'content': content
	}]
};



var template_name='new_quote';

var async = false;

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
	//console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
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
			//res.send(505,'Sorry Centurylink is Not Playing Nice');

	var request = require('request');
	var address = req.params.address;
	var findCookies = function(cookies) {
		var cookieBuffer = '';
		for(var cookie in cookies) {
			
			cookieBuffer += cookies[cookie].split(';')[0] +'; ';
		}
		return cookieBuffer;
	};



	var checkAddress = function(id, cookies, callback) {

		request.post({
			url: 'https://shop.centurylink.com/MasterWebPortal/freeRange/smb/shopjumpin.action', 
			headers: {
				'Cookie': cookies + ' remember_me=addressID%7C'+id+'; profile_cookie=redirectTarget%7Chttps%3A%2F%2Fshop.centurylink.com%2Fsmall-business%2Fproducts%2Fbundles%2F~redirectTargetQ%7Chttps%3A%2F%2Fshop.centurylink.com%2FMasterWebPortal%2FfreeRange%2Fshop%2FSMBNCBundle.action%3FselectedProd%3Dcc~redirectTargetCTL%7Chttps%3A%2F%2Fshop.centurylink.com%2Fsmallbusiness%2Fproducts%2Fbundles%2Fcore-connect%2F; '
			}

		}, callback);
	}

	var b = request('https://shop.centurylink.com/small-business/', function(err, response, body) {
		if(err) {
			console.log('err? ', err);
		}

		for(var cookie in response.headers['set-cookie']) {
			if(response.headers['set-cookie'][cookie].match(/TCAT_JSESSIONID/g)) {
				
				var currentCookie = response.headers['set-cookie'][cookie].split(';');
				for(var c in currentCookie) {
					if(currentCookie[c].match(/TCAT_JSESSIONID/g)) {
						
						var tcat = currentCookie[c].split('=')[1];

						console.log('Session %s started\nAttempting to search for addressid: %s', tcat, address);
						checkAddress(address, findCookies(response.headers['set-cookie']), function(err, response, body) {
							var re = /addressid2.{9}(.*)' /g;
							var matches = re.exec(body);
							var awesome = function(cookies) {
								request({
									url: 'https://shop.centurylink.com/MasterWebPortal/freeRange/smb/SMBDisplay.action',
									headers: {
										'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
										Referer: 'https://shop.centurylink.com/MasterWebPortal/freeRange/smb/shopjumpin.action',
										'Cookie': cookies
										
									}
								}, function(err, response, body) {
									// var results = [];
									// var re = /DisplayProduct:.*Internet ([0-9\.]+)([a-zA-Z]).*[\/]([0-9]+)([a-zA-Z]).*ps/g;
									// var m;
								//console.log('ResponseBody ', body);
									// var index = body.search('End ProductConfiguration');
									// if(index > -1) {
									// 	//console.log('Found index at: %d original size is: %d', index, body.length);
									// 	body = body.substring(0, index);
										
									// }
									// while (m = re.exec(body)) {
										
									// 	if (m.index === re.lastIndex) {
									// 		re.lastIndex++;
									// 	}
										
									// 	results.push({
									// 		name: m[1] + '.' + m[3],
									// 		value: m[1] + m[2] + 'bps/' + m[3] + m[4] + 'bps',
									// 		svalue: m[1] + m[2] + '/' + m[3] + m[4],
									// 		download: m[1],
									// 		downloadRate: m[2],
									// 		upload: m[3],
									// 		uploadRate: m[4]
									// 	});
									// }

									// //console.log(results);
									// res.send({speeds: results});
									res.send(body);
									return true;
								});
							};

							if(matches) {

								//console.log('Found multi unit address re-quering server for primary unit number (%s)', matches[1].split('|')[2]);
								checkAddress(address+'~geoSecId%7C' + matches[1].split('|')[2], findCookies(response.headers['set-cookie']), function(err, response, body) {
									awesome(response.headers['set-cookie']);
								});
							} else {
								//console.log('no mismatch found, fetching bandwidth availability');
								awesome(findCookies(response.headers['set-cookie']) + ' TCAT_JSESSIONID='+tcat+'; ');
							}
						});
						
					}
				}
			}
		}
	});
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

//getLeadsByState
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

//getLeadsByStatus
exports.getLeadsByStatus = function(req, res) {
	//console.log('got to getLeadsByStatus');

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	var n = 2;
	switch(n)
	{
		case 1:
		var mytot = Lead.aggregate([ { $match: {assignedRep:req.user.displayName} }, {
		'$group': { 
			_id: '$status',
			total: {
				'$sum': 1
			}
		}
	}]);
		break;

		case 2:
		var mytot = Lead.aggregate([ {
		'$group': { 
			_id: '$status',
			total: {
				'$sum': 1
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

//Count Total Leads
exports.getLeadsbyTotal = function(req, res) {
	//console.log('got to Count Deals FIND USER %o', req.user);

	//'No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'
	var n = 1;
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
exports.leadByID = function(req, res, next, id) { Lead.findById(id).populate('user', 'displayName').exec(function(err, lead) {
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