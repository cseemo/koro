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
		required: 'Please include first name',
		trim: true
		
	},
		lastName: {
		type: String,
		required: 'Please include last name',
		trim: true
		
	},
		mInitial: {
		type: String,
		trim: true
		
	},
		displayName: {
		type: String,
		trim: true
		
	},
	dobMO: {
		type: Number
	},
	dobDAY: {
		type: Number
	},
	dobYR: {
		type: Number
	},
	created: {
		type: Date,
		default: Date.now
	},
		dob: {
		type: Date,
		default: null
	},
		deployedDate: {
		type: Date,
		default: null
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	merchantCustomerId: {
		type: Number

	},
	paymentProfileId: {
		type: Number

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
	last4: {
		type: String,
		trim: true
	},
		term: {
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
	}, 
	assignedShop: {
		type: Schema.ObjectId,
		ref: 'Shop',
		default: null
	
	}, 
	pendingWorkOrder: {
		type: Schema.ObjectId,
		ref: 'Workorder',
		default: null

	}, 
	pendingWorkType: {
		type: String,
		default: 'Unkown',
		trim: true
	},
	agreementSigned: {
		type: Boolean,
		default: false
	},
	cardNumber: {
		type: String,
		default: '',
		trim: true
	},
	cardCVV: {
		type: String,
		default: '',
		trim: true
	},
	cardExp: {
		type: String,
		default: '',
		trim: true
	},
	billDate: {
		type: Number,
		default: 10
	},
	finalBillDate: {
		type: Date
	},
	deviceSN: {
		type: String,
		trim: true
	},
	device: {
		type: Schema.ObjectId,
		ref: 'Device',
		default: null

	}, 
	authNetErr: {
		type: String,
		trim: true,
		default: null
	}


});

mongoose.model('Offender', OffenderSchema);