'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var destroys = require('../../app/controllers/destroys.server.controller');

	// Destroys Routes
	app.route('/destroys')
		.get(destroys.list)
		.post(users.requiresLogin, destroys.create);

	app.route('/destroys/:destroyId')
		.get(destroys.read)
		.put(users.requiresLogin, destroys.hasAuthorization, destroys.update)
		.delete(users.requiresLogin, destroys.hasAuthorization, destroys.delete);

	// Finish by binding the Destroy middleware
	app.param('destroyId', destroys.destroyByID);
};
