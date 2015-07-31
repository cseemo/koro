'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Plant = mongoose.model('Plant'),
	_ = require('lodash');

/**
 * Create a Plant
 */
exports.create = function(req, res) {
	var plant = new Plant(req.body);
	plant.user = req.user;

	plant.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};

/**
 * Show the current Plant
 */
exports.read = function(req, res) {
	res.jsonp(req.plant);
};

/**
 * Update a Plant
 */
exports.update = function(req, res) {
	var plant = req.plant ;

	plant = _.extend(plant , req.body);

	plant.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};

/**
 * Delete an Plant
 */
exports.delete = function(req, res) {
	var plant = req.plant ;

	plant.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};

/**
 * List of Plants
 */
exports.list = function(req, res) { 
	Plant.find().sort('-created').populate('user', 'displayName').exec(function(err, plants) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plants);
		}
	});
};

/**
 * Plant middleware
 */
exports.plantByID = function(req, res, next, id) { 
	Plant.findById(id).populate('user', 'displayName').exec(function(err, plant) {
		if (err) return next(err);
		if (! plant) return next(new Error('Failed to load Plant ' + id));
		req.plant = plant ;
		next();
	});
};

/**
 * Plant authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.plant.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
