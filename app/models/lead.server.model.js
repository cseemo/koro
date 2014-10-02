'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Calls Schema
 */
var CallSchema = new Schema({
	
	calltime: {
		type: Date,
		default: ''
	},
	comments: {
		type: String,
		default: ''
	},
	rep: {
		type: String,
		default: ''
	},
	who: {
		type: String,
		default: ''
	},
	gatekeeper: {
		type: String,
		default: ''
	},
	disposition: {
		type: String,
		default: ''
	}

});

mongoose.model('Call', CallSchema, 'leads');


/**
 * Lead Schema
 */
var LeadSchema = new Schema({
	companyname: {
		type: String,
		default: '',
		required: 'Please fill in Company Name',
		trim: true
	},
	callDetails: [CallSchema.schema],
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
	status: {
		type: String,
		default:'Lead'
	},
	created: {
		type: Date,
		default: Date.now
	},
	assignedRep: {
		type: String,
		default: null
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	dslspeed: {
		type: String
	},
	adl: {
		type: String
	},
	term: {
		type: String
	},
	modem: {
		type: String
	},
	staticip: {
		type: String
	},
	waivenrcs: {
		type: String
	},
	winbackcredits: {
		type: String
	},
	quoteDate: {
		type: Date,
		default: null
	},
	mrc: {
		type: String,
		default: null
	},
	nrc: {
		type: String,
		default: null
	},
	dsl: {
		type: String,
		default: null,
		trim: true
	}


});


mongoose.model('Lead', LeadSchema, 'leads');

