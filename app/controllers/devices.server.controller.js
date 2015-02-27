'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('errors'),
	Device = mongoose.model('Device'),
	_ = require('lodash');

/**
 * Create a Device
 */

 exports.appCheckIn = function(req, res) {
 	console.log('Checking in new app...');
 	console.log(req.body);
 	// res.status(200).send('Checked In');

 	// console.log('User: ', req.body.user);
 	var parsed = JSON.parse(req.body.user);
 	var name = parsed.displayName;
 	console.log('Parsed Name:', name);

 	var details = [];
			details.push({
					type: 'New Device - Scanned In',
					updated: Date.now(),
					destination: 'New Inventory',
					requestor: name,
					notes: req.body.notes,
	
				});

 	var device = new Device ({
 		type: req.body.type,
		notes: req.body.notes,
		serialNumber: req.body.serialNumber,
		status: 'Available',
		details: details,
		user: req.body.user
 	});

 	

 		device.save(function(err, data) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			console.log('Device Saved', data);
			res.status(211).send(data);
		}
	});


 };
exports.create = function(req, res) {
	var device = new Device(req.body);
	device.user = req.user;
	// device.details.push(
	// {type: 'Check In'},
	// {updated: Date.now()},
	// {destination: 'New Inventory'},
	// {requestor:req.user.displayName}
	// );
	console.log('Device: ', device);

	// ['type'] = 'Check In', 
	// device.details['destination'] = 'New Inventory', 
	// device.details['requestor'] = req.user.displayName, 
	// device.details['updated'] = Date.now(); 

				
	device.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/**
 * Show the current Device
 */
exports.read = function(req, res) {
	res.jsonp(req.device);
};

/**
 * Update a Device
 */
exports.update = function(req, res) {
	var device = req.device ;

	device = _.extend(device , req.body);

	device.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};


	//Get Available Devices
	exports.getAvailableDevices = function(req, res){
		Device.find({status: 'Available'}).sort('-created').exec(function(err, devices) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devices);
		}
	});

	};
/**
 * Delete an Device
 */
exports.delete = function(req, res) {
	var device = req.device ;

	device.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/**
 * List of Devices
 */
exports.list = function(req, res) { 
	console.log('Request: ', req.query);
	console.log('Do we have a user? ', req.user);
	if(req.user===undefined){
		// console.log('No user...lets see if we have an id? ', req.body);
		var userId = req.query.id;
		console.log('UserID: ', userId);
		req.query = "";

	}
	Device.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, devices) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log('Found '+devices.length+' devices...');
			res.jsonp(devices);
		}
	});
};

/**
 * Device middleware
 */
exports.deviceByID = function(req, res, next, id) { Device.findById(id).populate('user', 'displayName').exec(function(err, device) {
		if (err) return next(err);
		if (! device) return next(new Error('Failed to load Device ' + id));
		req.device = device ;
		next();
	});
};

/**
 * Device authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.device.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};