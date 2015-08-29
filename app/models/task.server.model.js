'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
	name: {
		type: String,
		default: null,
		trim: true
	},
	details: {
		type: String,
		default: null,
		trim: true
	},
	assignedTo: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	assignedby: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	dueDate: {
		type: Date,
		default: null
	},
	repeat: {
		type: String,
		default: null,
		trim: true
	},
	repeatCycle: {
		type: String,
		default: null,
		trim: true
	},
	repeatDueBy: {
		type: String,
		default: null,
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	completed: {
		type: Date,
		default: null
	},
	completionNotes: {
		type: String,
		default: null,
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	status: {
		type: String,
		default: null,
		trim: true
	},

});

mongoose.model('Task', TaskSchema);