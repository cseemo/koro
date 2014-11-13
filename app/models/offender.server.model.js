'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Offender Schema
 */
var OffenderSchema = new Schema({
	firstName: {
		type: String,
		required: 'Please include first name'
		
	},
		lastName: {
		type: String,
		required: 'Please include first name'
		
	},
	created: {
		type: Date,
		default: Date.now
	},
		dob: {
		type: Date,
		default: null
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},

		driverNumber: {
		type: String,
		
		trim: true
	},
		vehicleMake: {
		type: String,
		
		trim: true
	},
	
		vehicleModel: {
		type: String,
		
		trim: true
	},
		vehicleYear: {
		type: String,
		
		trim: true
	},
		mainPhone: {
		type: String,
		
		trim: true
	},
		altPhone: {
		type: String,
		
		trim: true
	},
		offenderEmail: {
		type: String,
		
		trim: true
	},
		billingAddress: {
		type: String,
		
		trim: true
	},
			billingCity: {
		type: String,
		
		trim: true
	},
			billingState: {
		type: String,
		
		trim: true
	},
			billingZipcode: {
		type: String,
		
		trim: true
	},
			stateReportTo: {
		type: String,
		default: 'AZ',
		trim: true
	}

});

mongoose.model('Offender', OffenderSchema);