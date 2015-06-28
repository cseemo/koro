'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dispensary Schema
 */
var DispensarySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Dispensary name',
		trim: true
	},
	url: {
		type: String,
		default: null,
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

mongoose.model('Dispensary', DispensarySchema);