'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Offender = mongoose.model('Offender'),
	_ = require('lodash');

/**
 * Create a Offender
 */
exports.create = function(req, res) {
	console.log('Reqeust Body', req.body);
	var offender = new Offender(req.body);
	offender.user = req.user;
	console.log('Offender Info: ', offender);

	offender.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offender);
		}
	});
};

/**
 * Show the current Offender
 */
exports.read = function(req, res) {
	res.jsonp(req.offender);
};

/**
 * Update a Offender
 */
exports.update = function(req, res) {
	var offender = req.offender ;

	offender = _.extend(offender , req.body);

	offender.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offender);
		}
	});
};

/**
 * Delete an Offender
 */
exports.delete = function(req, res) {
	var offender = req.offender ;

	offender.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offender);
		}
	});
};

/**
 * List of Offenders
 */
exports.list = function(req, res) { Offender.find().sort('-created').populate('user', 'displayName').exec(function(err, offenders) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(offenders);
		}
	});
};

/**
 * Offender middleware
 */
exports.offenderByID = function(req, res, next, id) { Offender.findById(id).populate('user', 'displayName').exec(function(err, offender) {
		if (err) return next(err);
		if (! offender) return next(new Error('Failed to load Offender ' + id));
		req.offender = offender ;
		next();
	});
};

/**
 * Offender authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.offender.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};