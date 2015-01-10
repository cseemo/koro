'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var moment = require('moment');
var nextMonth = moment().add(30, 'days').hours(0).minutes(0).seconds(0);

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
	dueDate: {
		type: Date,
		default: nextMonth
	},
	paidDate: {
		type: Date,
		default: null
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	pmtType: {
		type: String,
		trim: true
	},
	pmtOpt: {
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
	authCode: {
		type: String,
		trim: true
	},

});

mongoose.model('Payment', PaymentSchema);