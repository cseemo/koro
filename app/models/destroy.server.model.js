'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Destroy Schema
 */
var DestroySchema = new Schema({
	methodOfDestruction: {
		type: String,
		default: null,
		
		trim: true
	},
	reasonToDestroy: {
		type: String,
		default: null,
		
		trim: true
	},
	weight: {
		type: String,
		default: null,
		trim: true
	},
	plantId: {
		type: String,
		default: null,
		trim: true
	},
	roomId: {
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

mongoose.model('Destroy', DestroySchema);