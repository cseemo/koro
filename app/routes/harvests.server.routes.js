'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var harvests = require('../../app/controllers/harvests.server.controller');

	// Harvests Routes
	app.route('/harvests')
		.get(harvests.list)
		.post(users.requiresLogin, harvests.create);

	app.route('/harvests/:harvestId')
		.get(harvests.read)
		.put(users.requiresLogin, harvests.hasAuthorization, harvests.update)
		.delete(users.requiresLogin, harvests.hasAuthorization, harvests.delete);

	// Finish by binding the Harvest middleware
	app.param('harvestId', harvests.harvestByID);
};
