'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Destroy = mongoose.model('Destroy'),
	_ = require('lodash');

/**
 * Create a Destroy
 */
exports.create = function(req, res) {
	var destroy = new Destroy(req.body);
	destroy.user = req.user;

	destroy.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(destroy);
		}
	});
};

/**
 * Show the current Destroy
 */
exports.read = function(req, res) {
	res.jsonp(req.destroy);
};

/**
 * Update a Destroy
 */
exports.update = function(req, res) {
	var destroy = req.destroy ;

	destroy = _.extend(destroy , req.body);

	destroy.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(destroy);
		}
	});
};

/**
 * Delete an Destroy
 */
exports.delete = function(req, res) {
	var destroy = req.destroy ;

	destroy.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(destroy);
		}
	});
};

/**
 * List of Destroys
 */
exports.list = function(req, res) { 
	Destroy.find().sort('-created').populate('user', 'displayName').exec(function(err, destroys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(destroys);
		}
	});
};

/**
 * Destroy middleware
 */
exports.destroyByID = function(req, res, next, id) { 
	Destroy.findById(id).populate('user', 'displayName').exec(function(err, destroy) {
		if (err) return next(err);
		if (! destroy) return next(new Error('Failed to load Destroy ' + id));
		req.destroy = destroy ;
		next();
	});
};

/**
 * Destroy authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.destroy.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};
