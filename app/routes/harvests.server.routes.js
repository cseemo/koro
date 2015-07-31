'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var harvests = require('../../app/controllers/harvests.server.controller');

	// Harvests Routes
	app.route('/harvests')
		.get(harvests.list)
		.post(users.requiresLogin, harvests.create);

	app.route('/getStage1Plants')
		.get(harvests.getStage1Plants);

	app.route('/getStage2Plants')
		.get(harvests.getStage2Plants);

	app.route('/getStage3Plants')
		.get(harvests.getStage3Plants);

		
	app.route('/getReadyToHarvestPlants')
		.get(harvests.getReadyToHarvestPlants);

	app.route('/harvests/:harvestId')
		.get(harvests.read)
		.put(users.requiresLogin, harvests.hasAuthorization, harvests.update)
		.delete(users.requiresLogin, harvests.hasAuthorization, harvests.delete);

	// Finish by binding the Harvest middleware
	app.param('harvestId', harvests.harvestByID);
};
