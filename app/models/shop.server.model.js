'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Shop Schema
 */
var ShopSchema = new Schema({
	name: {
		type: String,
		default: '',
		// required: 'Please fill Shop name',
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
	address: {
			type: String,
			trim: true
	},
	city: {
			type: String,
			trim: true
	},
	state: {
			type: String,
			trim: true
	},
	zipcode: {
			type: String,
			trim: true
	},
	email: {
			type: String,
			trim: true
	},
	fax: {
			type: String,
			trim: true
	},
	telephone: {
			type: String,
			trim: true
	},
	alttelephone: {
			type: String,
			trim: true
	},
	primarycontactname: {
			type: String,
			trim: true
	},
	altcontactname: {
			type: String,
			trim: true
	},
	signertitle: {
			type: String,
			trim: true
	},
	signer: {
			type: String,
			trim: true
	}
});

mongoose.model('Shop', ShopSchema);