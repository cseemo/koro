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
	offender: {
		type: String,
		ref: 'Offender'
		
	}
});

mongoose.model('Workorder', WorkorderSchema);