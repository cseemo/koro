'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Deal = mongoose.model('Deal'),
	_ = require('lodash');

/**
 * Create a Deal
 */
exports.create = function(req, res) {
	var deal = new Deal(req.body);
	deal.user = req.user;
	console.log('Chaddeal %o', deal);

	deal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: 'Hmmm...'
			});
		} else {
			res.jsonp(deal);
		}
	});
};

//Get Deals
exports.getDEALS = function(req, res) { Deal.find().where({user: req.user.id}).sort('-converted').limit(50).exec(function(err, deals) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			//console.log('leads %o',leads);
			res.jsonp(deals);
		}
	});
};

/**
 * Show the current Deal
 */
exports.read = function(req, res) {
	res.jsonp(req.deal);
};

/**
 * Update a Deal
 */
exports.update = function(req, res) {
	var deal = req.deal ;

	deal = _.extend(deal , req.body);

	deal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deal);
		}
	});
};

/**
 * Delete an Deal
 */
exports.delete = function(req, res) {
	var deal = req.deal ;

	deal.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deal);
		}
	});
};

/**
 * List of Deals
 */
exports.list = function(req, res) { Deal.find().sort('-created').populate('user', 'displayName').exec(function(err, deals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deals);
		}
	});
};

/**
 * Deal middleware
 */
exports.dealByID = function(req, res, next, id) { Deal.findById(id).populate('user', 'displayName').exec(function(err, deal) {
		if (err) return next(err);
		if (! deal) return next(new Error('Failed to load Deal ' + id));
		req.deal = deal ;
		next();
	});
};

/**
 * Deal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.deal.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};