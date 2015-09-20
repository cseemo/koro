'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Clone Schema
 */
var CloneSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	strain: {
		type: String,
		default: null,
		trim: true
	},
	motherObjectId: {
		type: Schema.ObjectId,
		ref: 'Plant'
	},
	motherId: {
		type: String,
		default: null,
		trim: true
	},
	boxId: {
		type: String,
		default: null,
		trim: true
	},
	roomId: {
		type: String,
		default: null,
		trim: true
	},
	puckLocation: {
		type: String,
		default: null,
		trim: true
	},
	destroyed: {
		type: Boolean,
		default: false
	},
	destroyMethod: {
		type: String,
		default: null,
		trim: true
	},
	destroyedBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	activeClone: {
		type: Boolean,
		default: true
	},
	inCup: {
		type: Boolean,
		default: false
	},
	transferDate: {
		type: Date,
		default: null
	},
	topped: {
		type: Boolean,
		default: null
	},
	destroyReason: {
		type: String,
		default: null,
		trim: true
	},
});

mongoose.model('Clone', CloneSchema);