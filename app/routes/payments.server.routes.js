'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var payments = require('../../app/controllers/payments');

	// Payments Routes
	app.route('/payments')
		.get(users.requiresLogin, payments.list)
		.post(payments.create);

	app.route('/payments/:paymentId')
		.get(payments.read)
		.put(payments.update)
		.delete(users.requiresLogin, payments.hasAuthorization, payments.delete);

	// Finish by binding the Payment middleware
	app.param('paymentId', payments.paymentByID);
};