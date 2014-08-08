'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var leads = require('../../app/controllers/leads');

	// Leads Routes
	app.route('/leads')
		.get(leads.listbyRep)
		.post(users.requiresLogin, leads.create);

		app.route('/getnewlead')
		.get(leads.oldestFirst);

		app.route('/quote')
		.post(leads.createQuote);

	app.route('/leads/:leadId')
		.get(users.requiresLogin, leads.hasAuthorization, leads.read)
		.put(users.requiresLogin, leads.hasAuthorization, leads.update)
		.delete(users.requiresLogin, leads.hasAuthorization, leads.delete);

		
	// Finish by binding the Lead middleware
	app.param('leadId', leads.leadByID);
};