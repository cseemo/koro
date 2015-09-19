'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Clone = mongoose.model('Clone'),
	_ = require('lodash');
	





//Get Box IDs
exports.getCloneBoxIds = function(req, res){
	console.log('getting clone box ids...');
	console.log('Query: ', req.query);
	Clone.aggregate([
		{$group: {_id: "$boxId"}}


				]).exec(function(err, results) {
		if (err) {
			console.log('We gots an err...', err);
			return callback('Error: '+err);
		} else {
			console.log('Got the box ids....', results);
			res.jsonp(results);

		}

	});
};



/**
 * Create a Clone
 */
exports.create = function(req, res) {
	var clone = new Clone(req.body);
	clone.user = req.user;

	clone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(clone);
		}
	});
};

/**
 * Show the current Clone
 */
exports.read = function(req, res) {
	res.jsonp(req.clone);
};

/**
 * Update a Clone
 */
exports.update = function(req, res) {
	var clone = req.clone ;

	clone = _.extend(clone , req.body);

	clone.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(clone);
		}
	});
};

/**
 * Delete an Clone
 */
exports.delete = function(req, res) {
	var clone = req.clone ;

	clone.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(clone);
		}
	});
};

/**
 * List of Clones
 */
exports.list = function(req, res) { 
	Clone.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, clones) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(clones);
		}
	});
};

/**
 * Clone middleware
 */
exports.cloneByID = function(req, res, next, id) { 
	Clone.findById(id).populate('user', 'displayName').exec(function(err, clone) {
		if (err) return next(err);
		if (! clone) return next(new Error('Failed to load Clone ' + id));
		req.clone = clone ;
		next();
	});
};

/**
 * Clone authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.clone.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
