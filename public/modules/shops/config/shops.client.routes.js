'use strict';

//Setting up route
angular.module('shops').config(['$stateProvider',
	function($stateProvider) {
		// Shops state routing
		$stateProvider.
		state('listShops', {
			url: '/shops',
			templateUrl: 'modules/shops/views/list-shops.client.view.html'
		}).
		state('createShop', {
			url: '/shops/create',
			templateUrl: 'modules/shops/views/create-shop.client.view.html'
		}).
		state('viewShop', {
			url: '/shops/:shopId',
			templateUrl: 'modules/shops/views/view-shop.client.view.html'
		}).
		state('editShop', {
			url: '/shops/:shopId/edit',
			templateUrl: 'modules/shops/views/edit-shop.client.view.html'
		});
	}
]);