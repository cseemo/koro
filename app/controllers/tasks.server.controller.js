'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Task = mongoose.model('Task'),
	_ = require('lodash');



//Test Phone 
exports.testPhone = function(req, res){
	console.log('Testing Phone...');
	var response = '<Response><Play>http://45.55.12.241:5000/modules/core/sounds/payYourBill.mp3</Play><Pause length="2"/><Say voice="alice">Hello, John. This is Alice with Budget IID. You owe us money. We want our money. Send us our money!.</Say><Say voice="alice">Call us back TODAY!.</Say></Response>'
	res.status(200).send(response);
};
/**
 * Create a Task
 */
exports.create = function(req, res) {
	var task = new Task(req.body);
	task.user = req.user;
	// console.log(req.io);
	task.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('About to send task to '+task.assignedTo);
			req.io.emit(task.assignedTo,{status: 'New Task', task: task} );
			res.jsonp(task);
		}
	});
};

//Reject a task
exports.rejectTask = function(req, res){
	console.log('Time to reject this bitch!!!');
	// console.log(req.body);
	var task = req.body;
	req.io.emit(task.assignedTo._id, {status: 'Rejected', task: task} );
	res.status(200).send('Finished');
};

/**
 * Show the current Task
 */
exports.read = function(req, res) {
	res.jsonp(req.task);
};

/**
 * Update a Task
 */
exports.update = function(req, res) {
	var task = req.task ;

	task = _.extend(task , req.body);

	task.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

/**
 * Delete an Task
 */
exports.delete = function(req, res) {
	var task = req.task ;

	task.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(task);
		}
	});
};

//Get all tasks and populate user....
exports.allOfOurTasks = function(req, res){
	console.log('We shouldnt need this');
	// {status: {$ne: 'Complete'}}
	Task.find().sort('-created').populate('assignedTo').exec(function(err, tasks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tasks);
		}
	});
};
/**
 * List of Tasks
 */
exports.list = function(req, res) { 
	Task.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, tasks) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tasks);
		}
	});
};

/**
 * Task middleware
 */
exports.taskByID = function(req, res, next, id) { 
	Task.findById(id).populate('user', 'displayName').exec(function(err, task) {
		if (err) return next(err);
		if (! task) return next(new Error('Failed to load Task ' + id));
		req.task = task ;
		next();
	});
};

/**
 * Task authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.task.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};
