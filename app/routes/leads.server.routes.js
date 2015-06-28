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

		app.route('/email/:leadId')
		.post(leads.sendQuote);

		 app.route('/leads/:leadId')
		.get(users.requiresLogin, leads.read)
		.put(users.requiresLogin, leads.update)
		.delete(users.requiresLogin, leads.hasAuthorization, leads.delete);

		app.route('/letsdoi/:leadId')
		.get(leads.usergetLead);
		// .put(leads.usersignup);


		

		
		app.route('/flups')
		.get(leads.getFLUP);
	
		app.route('/getDeals')
		.get(leads.getDEALS);

		app.route('/getleadData')
		.get(leads.getLeadData);


		app.route('/qwest/check/:address')
		.get(leads.getQwestLoop);
		//.get(leads.qwestLoopQual);

		

		app.route('/leads/:leadId/emailinfo')
		.get(leads.leadByID, leads.getEmailInfo);

		app.route('/stats/leads/all/status')
		.get(leads.getAllLeadsByStatus);

		app.route('/stats/leads/by/status')
		.get(leads.getLeadsByStatus);


		app.route('/stats/leads/by/carrier')
		.get(leads.getLeadsByCarrier);

		app.route('/stats/leads/by/state')
		.get(leads.getLeadsByState);

		app.route('/stats/leads/all/state')
		.get(leads.getAllLeadsByState);
		
		app.route('/stats/leads/rep')
		.get(leads.getLeadsbyRep);

		app.route('/stats/leads/total')
		.get(leads.getLeadsbyTotal);
	
		//Get Call Details by Rep
		app.route('/records/calldetails/rep')
		.get(leads.getCallsbyRep);
		
		
	// Finish by binding the Lead middleware
	app.param('leadId', leads.leadByID);
	app.param('dealId', leads.dealByID);
};