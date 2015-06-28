'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Harvest Schema
 */
var HarvestSchema = new Schema({
	name: {
		type: String,
		default: '',
		trim: true
	},
		roomID: {
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
	numberOfPlants: {
		type: Number,
		default: null,
		trim: true
	},
	plants: [{
		number: {
			type: Number,
			default: null
		},
		plantID: {
			type: String,
			default: null,
			trim: true
		},
		wetWeight: {
			type: Number,
			default: null,
			trim: true
		},
		plantWeighIn: {
			type: Date,
			default: null
		}
	}],
	harvestBegin: {
			type: Date,
			default: null
		},
		harvestEnd: {
			type: Date,
			default: null
		},

});

mongoose.model('Harvest', HarvestSchema);