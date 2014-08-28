'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var leads = require('../../app/controllers/leads');
	var deals = require('../../app/controllers/deals');

	// Leads Routes
	app.route('/leads')
		.get(leads.list)
		.post(users.requiresLogin, leads.create);

		app.route('/getnewlead')
		.get(users.requiresLogin, leads.oldestFirst);

		app.route('/quote')
		.post(leads.createQuote);

		 app.route('/leads/:leadId')
		.get(users.requiresLogin, leads.read)
		.put(users.requiresLogin, leads.update)
		.delete(users.requiresLogin, leads.hasAuthorization, leads.delete);

		app.route('/flups')
		.get(leads.getFLUP);
	
		app.route('/getDeals')
		.get(leads.getDEALS);

		app.route('/getleadData')
		.get(leads.getLeadData);

		
	// Finish by binding the Lead middleware
	app.param('leadId', leads.leadByID);
	app.param('dealId', leads.dealByID);
};