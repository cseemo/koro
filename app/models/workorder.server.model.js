'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Workorder Schema
 */
var WorkorderSchema = new Schema({
	type: {
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
	},
	serviceCenter: {
		type: String,
		default: '',
		trim: true
	},
	shopId: {
		type: Schema.ObjectId,
		ref: 'Shop'
		
	},
	offender: {
		type: Schema.ObjectId,
		ref: 'Offender'
		
	},
	checkIn: {
		type: Date,
		default: null
	},
	status: {
		type: String,
		default: 'Pending'
		
	},
	completed: {
		type: Date,
		default: null
	},
	apptDate: {
		type: Date,
		default: null
	},
	deviceSN: {
		type: String,
		default: null,
		trim: true
		
	},
	svcAddress: {
		type: String,
		default: null,
		trim: true
		
	},
	deviceNotes: {
		type: String,
		default: null,
		trim: true
		
	},
	inspected: {
		type: Date,
		default: null
	},
	customerVideo: {
		type: Date,
		default: null
	},
	techName: {
		type: String,
		default: null,
		trim: true
		
	},
	authSigned: {
		type: Date,
		default: null
	},

});

mongoose.model('Workorder', WorkorderSchema);