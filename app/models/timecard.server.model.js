'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Calls Schema
 */
/*var shiftDetailsSchema = new Schema({
	
	type: {
		type: String,
		default: ''
	},
	time: {
		type: Date,
		default: null
	}
	
});

mongoose.model('shiftDetails', shiftDetailsSchema, 'timecard');*/

/**
 * Timecard Schema
 */
var TimecardSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	start: {
		type: Date,
		default: Date.now,
	},
	end: {
		type: Date,
		default: null,
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	secondsworked: {
		type: Number,
		default: 0
	}
});



mongoose.model('Timecard', TimecardSchema, 'timecard');