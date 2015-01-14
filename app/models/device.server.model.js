'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


var deviceDetailSchema = new Schema({

	type: {
		type: String,
		default: '',
		trim: true
	},
	updated: {
		type: Date,
		default: Date.now
	},
	notes: {
		type: String,
		default: null
	},
	destination: {
		type: String,
		default: null
	},
	requestor: {
		type: String,
		default: null
	},


});

mongoose.model('deviceDetail', deviceDetailSchema, 'devices');



/**
 * Device Schema
 */
var DeviceSchema = new Schema({
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
	serialNumber: {
		type: String,
		trim: true,
		default: null
	},
	notes: {
		type: String,
		trim: true,
		default: null
	},
	status: {
		type: String,
		trim: true,
		default: null
	},
	details: [deviceDetailSchema.schema],
	shopId: {
		type: Schema.ObjectId,
		ref: 'Shop'
		
	},
	offender: {
		type: Schema.ObjectId,
		ref: 'Offender'
	},
	
});

mongoose.model('Device', DeviceSchema, 'devices');