'use strict';

//Setting up route
angular.module('leads').config(['$stateProvider',
	function($stateProvider) {
		// Leads state routing
		$stateProvider.
		state('listLeads', {
			url: '/leads',
			templateUrl: 'modules/leads/views/list-leads.client.view.html'
		}).
		state('createLead', {
			url: '/leads/create',
			templateUrl: 'modules/leads/views/create-lead.client.view.html'
		}).
		state('viewLead', {
			url: '/leads/:leadId',
			templateUrl: 'modules/leads/views/view-lead.client.view.html'
		}).
		state('editLead', {
			url: '/leads/:leadId/edit',
			templateUrl: 'modules/leads/views/edit-lead.client.view.html'
		});
	}
]);