'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Upload Schema
 */
var UploadSchema = new Schema({
	session: {
		type: String,
		default: '',
	},
	filename: {
		type: String,
		default: '',
		required: 'Please specify original file name',
		trim: true
	},
	camera: {
		type: String,
		default: '',
	},
	location: {
		type: String,
		default: '',
		required: 'Please specify file location',
	},
	url: {
		type: String,
		default: '',
	},
	versions: {},
	size: {
		type: Number,
	},
	created: {
		type: Date,
		default: Date.now
	},
	anonymous: {
		type: Boolean,
		default: true
	},
	desc: {
		type: String,
		trim: true,
		default: 'N/A'
	},
	// properties: {
	// 	articleId: 'asdfasdfasdf'
	// 	whateverId: 'asdfasdf'
	// 	// Generic per-application properties
	// }
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Upload', UploadSchema);
