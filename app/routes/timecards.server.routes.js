'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var timecards = require('../../app/controllers/timecards');

	// Timecards Routes
	app.route('/timecards')
		.get(timecards.list)
		.post(users.requiresLogin, timecards.create);

	app.route('/timecards/:timecardId')
		.get(timecards.read)
		.put(users.requiresLogin, timecards.hasAuthorization, timecards.update)
		.delete(users.requiresLogin, timecards.hasAuthorization, timecards.delete);

	// Finish by binding the Timecard middleware
	app.param('timecardId', timecards.timecardByID);
};