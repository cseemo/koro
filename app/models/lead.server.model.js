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
		default: Date.now
	},
	comments: {
		type: String,
		default: 'WTF'
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
		required: 'Please fill Lead Contact Name',
		trim: true
	},
	telephone: {
		type: String,
		default: '602-555-1212',
		trim: true
	},
	address: {
		type: String,
		default: 'Address',
		trim: true
	},
	city: {
		type: String,
		default: 'City',
		trim: true
	},
	state: {
		type: String,
		default: 'State',
		trim: true
	},
	zipcode: {
		type: String,
		default: 'Zipcode',
		trim: true
	},
	lastCalled: {
		type: Date,
		default: '1/1/2014',
		trim: true
	},
	assigned: {
		type: Date,
		default: '1/1/2001',
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
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});



mongoose.model('Lead', LeadSchema, 'leads');
