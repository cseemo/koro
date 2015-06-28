'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dispensaries = require('../../app/controllers/dispensaries.server.controller');

	// Dispensaries Routes
	app.route('/dispensaries')
		.get(dispensaries.list)
		.post(users.requiresLogin, dispensaries.create);

	app.route('/dispensaries/:dispensaryId')
		.get(dispensaries.read)
		.put(users.requiresLogin, dispensaries.hasAuthorization, dispensaries.update)
		.delete(users.requiresLogin, dispensaries.hasAuthorization, dispensaries.delete);


	
		app.route('/getSpecials')
		.get(dispensaries.getSpecials);

	
	// Finish by binding the Dispensary middleware
	app.param('dispensaryId', dispensaries.dispensaryByID);
};
