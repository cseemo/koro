'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var clones = require('../../app/controllers/clones.server.controller');

	// Clones Routes
	app.route('/clones')
		.get(clones.list)
		.post(users.requiresLogin, clones.create);

	app.route('/getCloneBoxIds')
		.get(clones.getCloneBoxIds);
		
	app.route('/clones/:cloneId')
		.get(clones.read)
		.put(users.requiresLogin, clones.hasAuthorization, clones.update)
		.delete(users.requiresLogin, clones.hasAuthorization, clones.delete);

	// Finish by binding the Clone middleware
	app.param('cloneId', clones.cloneByID);
};
