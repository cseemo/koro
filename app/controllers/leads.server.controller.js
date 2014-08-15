'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Lead = mongoose.model('Lead'),
	Call = mongoose.model('Call'),
	Deal = mongoose.model('Deal'),
	_ = require('lodash');

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

//Test Posting our Form Data to PHP File to render PDF
exports.gogetQuote = function(req, res) {
console.log('Coming from gogetQuote: '+req.body);
res.send({Response: 'Good'});
	};


//Create a Quote
exports.createQuote = function(req, res) {

	/* Do logic here */
    //$log.info('Params: ', req.body);
	//console.log('Params: ', req);
	console.log(req.body.term);
	//console.log(req.params.dsl_speed);
	
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

console.log(dsl);
//Figure out Adl Lines 
if(isNaN(adl)){
adlPrice = 0;
console.log('isNan :(');
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


console.log('term: '+term + ' '+'DSl.Name: '+dsl.name);
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

console.log('Static'+staticIP);



var modemCostM = 0;
var modemCostN = 0;

if(modem.name==='Lease'){
modemCostM = parseFloat(6.95,2);
}
if(modem.name==='Purchase'){
modemCostN = parseInt(99);
}

console.log('Modem'+modem.name);

if(nrcs.name==='Yes'){
	adlcostN=0;
}else{
	//$99 for DSL
adlcostN = 99+parseInt(adl*42.5);
adlcostN = parseFloat(adlcostN, 2); 
}


console.log('DSL '+dslPrice);

var staticIPcost = staticIP.toFixed(2);
var currentPrice = parseInt(dslPrice)+parseInt(adlPrice)+parseFloat(staticIPcost)+modemCostM;

//console.log('NRR Stuff: '+adlcostN+' -- Modem: '+modemCostN);


var nrrCost = parseInt(adlcostN)+parseFloat(modemCostN);

//console.log('NRR Cost: '+nrrCost);
//console.log('Current Price'+currentPrice);
	// Return our object to the front end
	res.send({ price: currentPrice, nrr: nrrCost });
};




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
			//console.log('Lead to Be Sent %o', lead);
			res.jsonp(lead);
		}

			});
			}
		});
};


exports.createDeal = function(req, res) {
	var deal = new Deal(req.body);
	console.log('CreateDeal: %o', deal);
	deal.user = req.user;

	deal.save(function(err, callback) {
		if (err) {
			console.log('Error!! %o', err);
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			console.log('createDeal Passing: %o',callback);
			res.jsonp(deal);
		}
	});
};



exports.create = function(req, res) {
	var lead = new Lead(req.body);
	console.log(lead);
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
console.log('mystuff %o',mystuff);
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
		//console.log('Lead Data: %o',req.lead);
//console.log('User Data: %o',req.user);

	if(req.lead.user===null){
		//console.log('USER NULL !!!!  %o',req.user);

	req.lead.user = req.user;
	req.lead.assignedRep = req.user.displayName;
	}
	//console.log('Lead Data: %o',lead);
	req.lead.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			//console.log('Lead Data: %o',req.lead);
			res.jsonp(req.lead);
		}
	});
};



/**
 * Update a Lead
 */
exports.update = function(req, res) {


	var lead = req.lead ;
//console.log('Lead %o',lead);
//console.log('REQ',req);
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
console.log('REQ.deal %o',req.deal);

	var deal = req.deal ;
//console.log('Lead %o',lead);
//console.log('REQ',req);
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

	]}).where({user: req.user.id}).sort('-lastCalled').limit(50).exec(function(err, leads) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			//console.log('leads %o',leads);
			res.jsonp(leads);
		}
	});
};
/**
 * List of Leads
 */
exports.list = function(req, res) { Lead.find({$or: [ 
	{user: req.user.id},
	{assignedRep: null}

	]}).sort('-lastCalled').limit(50).exec(function(err, leads) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			//console.log('leads %o',leads);
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
			//console.log('leads %o',leads);
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