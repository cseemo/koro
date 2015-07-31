'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var plants = require('../../app/controllers/plants.server.controller');

	// Plants Routes
	app.route('/plants')
		.get(plants.list)
		.post(users.requiresLogin, plants.create);

	app.route('/plants/:plantId')
		.get(plants.read)
		.put(users.requiresLogin, plants.hasAuthorization, plants.update)
		.delete(users.requiresLogin, plants.hasAuthorization, plants.delete);

	// Finish by binding the Plant middleware
	app.param('plantId', plants.plantByID);
};
