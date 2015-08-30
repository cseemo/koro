'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Task = mongoose.model('Task'),
	_ = require('lodash');
	//require the Twilio module and create a REST client
var client = require('twilio')('AC6093896bcbf42853d90e01d0ef078583', '0d1c3e0579bbf810c15435bb47bc7516');


//Test Phone 
exports.testPhone = function(req, res){
	console.log('Testing Phone...');
	var response = '<Response><Play>http://45.55.12.241:5000/modules/core/sounds/payYourBill.mp3</Play><Pause length="2"/><Gather action="http://45.55.12.241:5000/respondToPhone" method="GET"><Say voice="alice">Hello, John. This is Alice with Budget IID. You owe us money. We want our money. Press 1 if you plan on paying us by Friday. Press 2 if you can pay us right now.</Say></Gather><Say voice="alice">Call us back TODAY!.</Say></Response>'
	res.status(200).send(response);
};


// Create (send) an SMS message
// POST /2010-04-01/Accounts/ACCOUNT_SID/SMS/Messages
// "create" and "update" aliases are in place where appropriate on PUT and POST requests
exports.testSMS = function(req, res){
	console.log('Test SMS...');
	client.sms.messages.post({
    to:'+16025185996',
    from:'+15596343553',
    body:'word to your mother.'
}, function(err, text) {
    console.log('You sent: '+ text.body);
    console.log('Current status of this text message is: '+ text.status);
});
};

exports.respondToPhone = function(req, res){
	console.log('Resonse...');
	console.log(req.body);
	console.log(req.query);
	var mystuff = '';
	if(req.query.digits==='1'){
		myStuff = 'We look forward to your payment. Please ensure we receive it no later than Friday at 5pm.';
	}
	if(req.query.digits==='2'){
		myStuff = 'Please stand by your telephone. Someone will call you in the next 5 minutes to accept that payment.';
	}


	// myStuff = 'We look forward to your payment. Please ensure we receive it no later than Friday at 5pm.';
	var response = '<Response><Say voice="alice">Thank you.</Say><Say>'+myStuff+'</Say></Response>'
	res.status(200).send(response);

};

exports.myPhone = function(req, res){
	console.log('Testing my phone...');
	//This REST call using the master/default account for the client...
client.makeCall({
    to:'+16025185996',
    from:'+15596343553',
    url:'http://45.55.12.241:5000/testPhone'
}, function(err, call) {
    console.log('This call\'s unique ID is: ' + call.sid);
    console.log('This call was created at: ' + call.dateCreated);
    res.status(200).send('Completed..');
});


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
