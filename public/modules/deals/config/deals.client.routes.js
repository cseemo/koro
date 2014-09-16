'use strict';

//Setting up route
angular.module('deals').config(['$stateProvider',
	function($stateProvider) {
		// Deals state routing
		$stateProvider.
		state('listDeals', {
			url: '/deals',
			templateUrl: 'modules/deals/views/list-deals.client.view.html'
		}).
		state('createDeal', {
			url: '/deals/create',
			templateUrl: 'modules/deals/views/create-deal.client.view.html'
		}).
		state('viewDeal', {
			url: '/deals/:dealId',
			templateUrl: 'modules/deals/views/view-deal.client.view.html'
		}).
		state('editDeal', {
			url: '/deals/:dealId/edit',
			templateUrl: 'modules/deals/views/edit-deal.client.view.html'
		}).
		state('approvingDeal', {
			url: '/approve/:dealId',
			templateUrl: 'modules/deals/views/approve-deal.client.view.html'
		}).
		state('convertingDeal', {
			url: '/convertingdeals/:dealId',
			templateUrl: 'modules/deals/views/convert-deal.client.view.html'
		});
	}
]);

