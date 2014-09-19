
'use strict';


/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var LineDetailSchema = new Schema({

	number: {
		type: String,
		default: ''
	},
	type: {
		type: String,
		default: ''
	},
	hunting: {
		type: String,
		default: ''
	},
	huntgroup: {
		type: String,
		default: ''
	},
	huntorder: {
		type: String,
		default: ''
	},
	vm: {
		type: String,
		default: ''
	},
	esm: {
		type: String,
		default: ''
	},
	nnk: {
		type: String,
		default: ''
	},
	cw: {
		type: String,
		default: ''
	},
	cwid: {
		type: String,
		default: ''
	},
	da6: {
		type: String,
		default: ''
	},
	eo3: {
		type: String,
		default: ''
	}


});

mongoose.model('LineDetail', LineDetailSchema, 'deals');




var DealSchema = new Schema({
	companyname: {
		type: String,
		default: '',
		trim: true
	},
	lineDetails: [LineDetailSchema.schema],
	mrc: {
		type: Number,
		default: 0
	},
	nrc: {
		type: Number,
		default: 0
	},
	email: {
		type: String,
		default: '',
		trim: true
	},
	contactname: {
		type: String,
		default: '',
		trim: true
	},
	contacttitle: {
		type: String,
		default: '',
		trim: true
	},
	contactemail: {
		type: String,
		default: '',
		trim: true
	},
	telephone: {
		type: String,
		default: '602-555-1212',
		trim: true
	},
	address: {
		type: String,
		default: '',
		trim: true
	},
	city: {
		type: String,
		default: '',
		trim: true
	},
	state: {
		type: String,
		default: '',
		trim: true
	},
	zipcode: {
		type: String,
		default: '',
		trim: true
	},
	lastCalled: {
		type: Date,
		default: '2001/01/01',
		trim: true
	},
	assigned: {
		type: Date,
		default: '2001/01/01',
		trim: true
	},
	campaign: {
		type: String,
		default: '',
		trim: true
	},
	FLUPDate: {
		type: Date,
		default: '',
		trim: true
	},
	speed: {
		type: String,
		default: '',
		trim: true
	},
	currentCarrier: {
		type: String,
		default: '',
		trim: true
	},
	assignedRep: {
		type: String,
		default: null
	},
	dslspeed: {
		type: String,
		default: ''
	},
	adl: {
		type: String,
		default: ''
	},
	term: {
		type: String,
		default: ''
	},
	modem: {
		type: String,
		default: ''
	},
	staticip: {
		type: String,
		default: ''
	},
	waivenrcs: {
		type: String,
		default: ''
	},
	winbackcredits: {
		type: String,
		default: ''
	},
	notes: {
		type: String,
		default: ''
	},
	projectmanager: {
		type: String,
		default: 'Nobody Yet'
	},
	converted: {
		type: Date,
		default: Date.now()
	},
	signDate: {
		type: String,
		default: ''
	},
	stage: {
		type: String,
		default: 'Pending Assignment'
	},
		stagenum: {
		type: Number,
		default: 5
	},
	ctlordernumber: {
		type: String,

	},

	billingtelephone: {
		type: String,
		default: null
	},
	billingcontact: {
		type: String,
		default: null
	},
	billingemail: {
		type: String,
		default: ''
	},
	taxid: {
		type: String,
		default: ''
	},
	website: {
		type: String,
		default: ''
	},
	billingaddress: {
		type: String,
		default: ''
	},
	billingcity: {
		type: String,
		default: ''
	},
	billingstate: {
		type: String,
		default: ''
	},
	billingzipcode: {
		type: String,
		default: ''
	},
	updated: {
		type: Date,
		
	}

	});

mongoose.model('Deal', DealSchema, 'deals');