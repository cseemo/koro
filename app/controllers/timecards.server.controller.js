'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	//errorHandler = require('./errors'),
	Timecard = mongoose.model('Timecard'),
	_ = require('lodash');

/**
 * Create a Timecard
 */
exports.create = function(req, res) {
	var timecard = new Timecard(req.body);
	timecard.user = req.user;

	timecard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timecard);
		}
	});
};

/**
 * Show the current Timecard
 */
exports.read = function(req, res) {
	res.jsonp(req.timecard);
};

/**
 * Update a Timecard
 */
exports.update = function(req, res) {
	var timecard = req.timecard ;

	timecard = _.extend(timecard , req.body);

	timecard.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timecard);
		}
	});
};

/**
 * Delete an Timecard
 */
exports.delete = function(req, res) {
	var timecard = req.timecard ;

	timecard.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timecard);
		}
	});
};

/**
 * List of Timecards
 */
exports.list = function(req, res) { Timecard.find().sort('-created').populate('user', 'displayName').exec(function(err, timecards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timecards);
		}
	});
};

/**
 * Timecard middleware
 */
exports.timecardByID = function(req, res, next, id) { Timecard.findById(id).populate('user', 'displayName').exec(function(err, timecard) {
		if (err) return next(err);
		if (! timecard) return next(new Error('Failed to load Timecard ' + id));
		req.timecard = timecard ;
		next();
	});
};

/**
 * Timecard authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.timecard.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};