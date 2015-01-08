'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Payment Schema
 */
var PaymentSchema = new Schema({
	offender: {
		type: Schema.ObjectId,
		ref: 'Offender'
	},
	workorder: {
		type: Schema.ObjectId,
		ref: 'Workorder'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	pmtType: {
		type: String,
		trim: true
	}, 
	amount: {
		type: String,
		trim: true
	},
	status: {
		type: String,
		trim: true
	},
	notes: {
		type: String,
		trim: true
	},

});

mongoose.model('Payment', PaymentSchema);