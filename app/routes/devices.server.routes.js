'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var devices = require('../../app/controllers/devices');

	// Devices Routes
	app.route('/devices')
		.get(devices.list)
		.post(users.requiresLogin, devices.create);

app.route('/getAvailableDevices')
		.get(devices.getAvailableDevices)

	app.route('/devices/:deviceId')
		.get(devices.read)
		.put(users.requiresLogin, devices.update)
		.delete(users.requiresLogin, devices.hasAuthorization, devices.delete);

	app.route('/devices/appCheckIn')
		.post(devices.appCheckIn);

	app.route('/devices/scan')
		.get(devices.lookForScan)

	// Finish by binding the Device middleware
	app.param('deviceId', devices.deviceByID);
};