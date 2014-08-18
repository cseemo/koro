'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Calls Schema
 */
var shiftDetailsSchema = new Schema({
	
	type: {
		type: String,
		default: ''
	},
	time: {
		type: Date,
		default: null
	}
	
});

mongoose.model('shiftDetails', shiftDetailsSchema, 'timecard');

/**
 * Timecard Schema
 */
var TimecardSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
	hourlyrate: {
		type: Number,
		default: 8,
	},
	shiftDetails: [shiftDetailsSchema.schema],
	date: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Timecard', TimecardSchema, 'timecard');