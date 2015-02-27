'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var payments = require('../../app/controllers/payments');
	var offenders = require('../../app/controllers/offenders');
	var workorders = require('../../app/controllers/workorders');

	// Payments Routes
	app.route('/payments')
		.get(users.requiresLogin, payments.list)
		.post(payments.create);

		
		app.route('/pmtsByOffender')
		.post(payments.getByOffender)
		.put(payments.update);

		
		app.route('/sendReceipt')
		.post(payments.sendReceipt);
		
		app.route('/checkpastdue')
		.post(payments.checkPastDue);

		app.route('/chargeCCard')
		.post(workorders.chargeCCard);

		app.route('/getPaymentProfiles')
		.post(payments.getPaymentProfiles);

		app.route('/chargeFirstMonth')
		.post(payments.chargeFirstMonth);

		app.route('/cleanUp')
		.get(payments.cleanUp);
		
		
		
		// .put(payments.update);

	app.route('/payments/:paymentId')
		.get(payments.read)
		.put(payments.update)
		.delete(users.requiresLogin, payments.delete);

	// Finish by binding the Payment middleware
	app.param('paymentId', payments.paymentByID);
	// app.param('offId', offenders.offenderByID);
};