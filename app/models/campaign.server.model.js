'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Campaign Schema
 */
var CampaignSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Campaign name',
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
	states: {
		type: Array,
		default: ['AZ', 'CO', 'IA', 'ID', 'MN', 'MT', 'ND', 'NE', 'OR', 'SD', 'UT', 'WA', 'WY']
	},
	carrier: {
		type: String,
		default: null
	}
});

mongoose.model('Campaign', CampaignSchema);
