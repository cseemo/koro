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
		console.log('Got to sauce');
		res.jsonp(timecard);
		console.log(timecard);
	});
	

};

exports.getByDay = function(req, res){
console.log('We got to get by day');
var now = Date.now();
console.log('Now: ',now);
var then = now-52344;
console.log('Then: ',then);
var today = new Date(),
day = today.getDate(),
year = today.getFullYear(),
month = today.getMonth();
var yesterday = new Date(year, month, day, '00','00','0','00');

console.log('What is yesterday?? ',yesterday);
var tomorrow = new Date(year, month, day, '23','59','59','59');
console.log('What is tomorrow?? ',tomorrow);
console.log('Date: '+month+'-'+day+'-'+year);
	// Timecard.aggregate({user: req.user._id, start: {$gte: yesterday}, end: {$lte: tomorrow}}).exec(function(err, timecards) {
	
			Timecard.aggregate([ { $match: {user:req.user._id} }, {
		'$group': { 
			_id: '$user',
			total: {
				'$sum': '$secondsworked'
			}
		}
	}]).exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			var total = 0;
			Object.keys(results).forEach(function(key) {
				total += results[key].total;
			});
			results.push({_id: 'total', 'total': total});
			res.jsonp(results);
		}
});




		// console.log('Got timecards',timecards);
		// var mystuff = {data: timecards};
		// res.jsonp(mystuff);
		// });
	// 	var shifts = [];
	// 	var minutesworked = 0;
	// 	if(timecards.length>0){
	// 		Object.keys(timecards).forEach(function(key){
	// 			var val = timecards[key];

	// 	console.log('My Value; ',val);


	// 	var difference = val.end-val.start;
	// 	var seconds = difference/1000;
	// 	var minutes = seconds/60;
	// 	console.log('Seconds logged in',seconds);
	// 	res.jsonp(difference);
	// 	console.log('Timecards, ',difference);
	// 	console.log('Minutes: , ',minutes);
	// 	console.log('minutes worked ',minutesworked);
	// 	minutesworked = minutesworked+minutes;
	// 	console.log('minutesworked2',minutesworked);

	// 		});
	// 		console.log('Total minutes worked',minutesworked);
	// 			console.log('Readyto ggroup the shifts by rep', shifts.length);
				

	// 			res.send('200', minutesworked);
	// 		}
	// 		else{
	// 	console.log('Sorry no timecards for taht date');
	// 	res.send('404', 'Sorry no timecards for that date');
	// }

			
		
		
		

	// });
	

};

exports.createClock = function(req, res) {
	
	var timecard = new Timecard({
		user: req.user.id
	});
	
	timecard.save();
	res.jsonp(timecard);
};

exports.clock = function(req, res) {
	console.log('got to clock function');
	Timecard.findOne({user: req.user.id, end: null}).exec(function(err, timecard) {
		if(err) {
			console.log(err);
			return;
		} 


		//console.log('Before: ', timecard);
		if(!timecard) {
			console.log('Clocking In');
			console.log('User creating timecard',req.user.displayName);


			timecard = new Timecard({
				user: req.user.id,
				name: req.user.displayName

			});
			res.jsonp({
				'card': timecard,
				'status': 'Created new time card'
			});

			timecard.save();
		} else {
			console.log('Clocking Out');
			timecard.end = new Date();
				var shifts = [];
				var minutesworked = 0;
				

				var difference = timecard.end-timecard.start;
				timecard.secondsworked = difference/1000;
				var seconds = difference/1000;
				var minutes = seconds/60;
				var hours = minutes/60;
				console.log('Timecards Worked microseconds ',difference);
				console.log('Seconds logged in',seconds);
				console.log('Minutes: , ',minutes);
				console.log('Hours: ',hours);
				
				timecard.save();
			res.jsonp({
				'timecard': timecard,
				'status': 'Clocked current time card out',
				'Hours Worked': hours,
				'Minutes Worked': minutes,
				'Seconds Worked': seconds
			});	
			
		}
	});
};

exports.lastShift = function(req, res) {
	console.log('Got to lastshift');
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
			console.log('Get Full year?? ',timecard.end.getFullYear());
			//console.log('Difference? ', timecard.Difference());
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

exports.getHours = function(req, res) {
Timecard.aggregate([{$group:{_id: '$name', timeworked: {$sum: '$secondsworked'}}}]).exec(function(err, results) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			console.log('Resutls ',results);
			var total = 0;
			Object.keys(results).forEach(function(key) {
				var test = results[key];
				var userid = results[key]._id;
				console.log('My test shit ',test);
			});
			results.push({_id: 'total', 'total': total});
			res.jsonp(results);
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