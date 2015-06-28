'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var SpecialSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	dispensaryName: {
		type: String,
		default: 'Dispensary Name',
		trim: true,
		
	},
	content: {
		type: String,
		default: '',
		trim: true
	},
	specials: {
		type: Array,
		default: ''
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Special', SpecialSchema);