'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Plant Schema
 */
var PlantSchema = new Schema({
	strain: {
		type: String,
		default: '',
		trim: true
	},
	clone: {
		type: Schema.ObjectId,
		ref: 'Clone'
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	number: {
		type: Number,
		default: null
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
	wetWeight: {
		type: Number,
		default: 0,
		
	},
	plantWeighIn: {
		type: Date,
		default: null
	}, 
	undefinedWeight: {
		type: Number,
		default: 0,
		
	},
	wasteWeight: {
		type: Number,
		default: 0,
		
	},
	aBudsWeight: {
		type: Number,
		default: 0,
		
	},
	bBudsWeight: {
		type: Number,
		default: 0,
		
	},
	motherId: {
	type: String,
	default: null,
	trim: true
	},
	inProduction: {
		type: Boolean,
		default: false
	},
	isMother: {
		type: Boolean,
		default: false
	},
	stage1Complete: {
		type: Boolean,
		default: false
	},
	stage2Complete: {
		type: Boolean,
		default: false
	},
	stage3Complete: {
		type: Boolean,
		default: false
	},
	batchId: {
			type: String,
			default: null
	},
	stage1Trim: [{
		totalWeight: {
			type: Number,
			default: 0
		},
		undefinedWeight: {
			type: Number,
			default: 0
		},
		wasteWeight: {
			type: Number,
			default: 0
		}
	}],
	stage2Trim: [{
		totalWeight: {
			type: Number,
			default: 0
		},
		undefinedWeight: {
			type: Number,
			default: 0
		},
		wasteWeight: {
			type: Number,
			default: 0
		}
	}],
	stage3Trim: [{
		totalWeight: {
			type: Number,
			default: 0
		},
		undefinedWeight: {
			type: Number,
			default: 0
		},
		wasteWeight: {
			type: Number,
			default: 0
		},
		trimWeight: {
			type: Number,
			default: 0
		},
		aBuds: {
			type: Number,
			default: 0
		},
		bBuds: {
			type: Number,
			default: 0
		},
		cBuds: {
			type: Number,
			default: 0
		}
	}],


});

mongoose.model('Plant', PlantSchema);