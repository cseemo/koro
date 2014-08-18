'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Timecard = mongoose.model('Timecard'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Registration already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

exports.sauce = function(req, res) {
	Timecard.find({user: req.user.id}).exec(function(err, timecard) {
		res.jsonp(timecard);
		console.log(timecard);
	});
	

};


exports.createClock = function(req, res) {
	
	var timecard = new Timecard({
		user: req.user.id
	});
	
	timecard.save();
	res.jsonp(timecard);
};

exports.clock = function(req, res) {
	Timecard.findOne({user: req.user.id, end: null}).exec(function(err, timecard) {
		if(err) {
			console.log(err);
			return;
		} 


		//console.log('Before: ', timecard);
		if(!timecard) {
			console.log('Clocking In');
			timecard = new Timecard({
				user: req.user.id,
			});
			res.jsonp({
				'card': timecard,
				'status': 'Created new time card'
			});

			timecard.save();
		} else {
			console.log('Clocking Out');
			timecard.end = new Date();
			res.jsonp({
				'timecard': timecard,
				'status': 'Clocked current time card out'
			});	
			timecard.save();
		}
	});
};

exports.lastShift = function(req, res) {
	Timecard.findOne({user: req.user.id}).where('end').ne(null).sort('-start').exec(function(err, timecard) {
		if(err) {
			console.log(err);
			return;
		} 
		if(!timecard) {
			console.log('No match');
			res.jsonp({
				'timecard': {},
				'status': 'Could not find card'
			});
		} else {
			console.log(timecard);
			console.log('typedef: ', typeof timecard.end);
			console.log(timecard.end.getFullYear());
			console.log('Difference? ', timecard.Difference());
		}
	});
};

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