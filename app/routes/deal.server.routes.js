'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var leads = require('../../app/controllers/leads');
	var deals = require('../../app/controllers/deals');

	// Leads Route
		app.route('/deals/:dealId')
		.put(users.requiresLogin, leads.updateDeal)
		.get(leads.showDeal);

		app.route('/convertingdeals/:dealId')
		.get(leads.showDeal);

		app.route('/convertingdeals/:dealId')
		.get(leads.showDeal);

		app.route('/deals')
		.get(leads.listdeals)
		.post(users.requiresLogin, leads.createDeal);
		

		
	// Finish by binding the Lead middleware
	
	app.param('dealId', leads.dealByID);
};