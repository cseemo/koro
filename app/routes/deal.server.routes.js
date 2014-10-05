'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var leads = require('../../app/controllers/leads');
	var deals = require('../../app/controllers/deals');

	// Leads Route
		app.route('/deals/:dealId')
		//Commetn out Requires Login foR APPROVAL w/o Login
		// .put(users.requiresLogin, deals.update)
		.put(deals.update)
		.get(leads.showDeal);

		// app.route('/convertingdeals')
		// .post(deals.sendOrderPacket);

		app.route('/convertingdeals/:dealId')
		.get(leads.showDeal)
		.post(deals.sendOrderPacket);

		app.route('/approve/:dealId')
		.get(deals.approveDeal)
		.put(deals.update);

		app.route('/pdf/:dealId')
		.get(deals.makePDF);

		app.route('/deals')
		.get(leads.listdeals)
		.post(users.requiresLogin, leads.createDeal);
		
		app.route('/admin')
		.get(leads.listdeals);

		app.route('/stats/deals/total')
		.get(deals.getDealsbyTotal);
		
		app.route('/stats/deals/mrctotal')
		.get(deals.getDealMRCTotal);
		
		app.route('/stats/deals/mrcrep')
		.get(deals.getDealMRCRep);
		

		
	// Finish by binding the Lead middleware
	
	app.param('dealId', leads.dealByID);
};