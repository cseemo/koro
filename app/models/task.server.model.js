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
	rejected: {
		type: Date,
		default: null
	},
	approved: {
		type: Date,
		default: null
	},
	lastUpdate: {
		type: Date,
		default: null
	},
	timesRejected: {
		type: Number,
		default: 0
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
	managerNotes: {
		type: String,
		default: null,
		trim: true
	},

});

mongoose.model('Task', TaskSchema);