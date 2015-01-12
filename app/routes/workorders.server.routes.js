'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var workorders = require('../../app/controllers/workorders');
	var offenders = require('../../app/controllers/offenders');

	// Workorders Routes
	app.route('/work/order')
		.get(workorders.email)
		.post(workorders.email);

		app.route('/approve/workorder/:workorderId')
		.get(workorders.signAuth)
		.post(workorders.signAuth);


		app.route('/workorders')
		.get(workorders.list)
		.post(users.requiresLogin, workorders.create);

		app.route('/orderByOffender/:offId')
		.get(workorders.getByOffender);

		app.route('/chargeCard/:workorderId')
		.post(workorders.runAuth);

		
		app.route('/getSignedDoc/:offenderId')
		.get(workorders.getSignedDoc);



		app.route('/viewWorkOrder/:workorderId')
		.get(workorders.viewOrder)
		.post(workorders.viewOrder);

		// app.route('/signWorkOrder/:workorderId')
		// .get(workorders.signWorkOrder);
		

		app.route('/workorders/:workorderId')
		.get(workorders.read)
		.put(workorders.update)
		.delete(users.requiresLogin, workorders.hasAuthorization, workorders.delete);

	// Finish by binding the Workorder middleware
	app.param('workorderId', workorders.workorderByID);
	app.param('offId', workorders.offenderByID);
	app.param('offenderId', offenders.offenderByID);
};

