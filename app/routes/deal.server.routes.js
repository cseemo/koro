'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var leads = require('../../app/controllers/leads');
	var deals = require('../../app/controllers/deals');

	// Leads Route
		app.route('/deals/:dealId')
		.put(users.requiresLogin, deals.update)
		.get(leads.showDeal);

		app.route('/convertingdeals/:dealId')
		.get(leads.showDeal);

		app.route('/approve/:dealId')
		.get(deals.approveDeal);

		app.route('/pdf/:dealId')
		.get(deals.makePDF);

		app.route('/deals')
		.get(leads.listdeals)
		.post(users.requiresLogin, leads.createDeal);
		
		app.route('/stats/deals/total')
		.get(deals.getDealsbyTotal);
		
		app.route('/stats/deals/mrctotal')
		.get(deals.getDealMRCTotal);
		

		
	// Finish by binding the Lead middleware
	
	app.param('dealId', leads.dealByID);
};