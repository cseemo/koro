'use strict';

//Setting up route
angular.module('dispensaries').config(['$stateProvider',
	function($stateProvider) {
		// Dispensaries state routing
		$stateProvider.
		state('listDispensaries', {
			url: '/dispensaries',
			templateUrl: 'modules/dispensaries/views/list-dispensaries.client.view.html'
		}).
		state('createDispensary', {
			url: '/dispensaries/create',
			templateUrl: 'modules/dispensaries/views/create-dispensary.client.view.html'
		}).
		state('viewDispensary', {
			url: '/dispensaries/:dispensaryId',
			templateUrl: 'modules/dispensaries/views/view-dispensary.client.view.html'
		}).
		state('editDispensary', {
			url: '/dispensaries/:dispensaryId/edit',
			templateUrl: 'modules/dispensaries/views/edit-dispensary.client.view.html'
		});
	}
]);