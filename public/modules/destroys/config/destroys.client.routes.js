'use strict';

//Setting up route
angular.module('destroys').config(['$stateProvider',
	function($stateProvider) {
		// Destroys state routing
		$stateProvider.
		state('listDestroys', {
			url: '/destroyLog',
			templateUrl: 'modules/destroys/views/list-destroys.client.view.html'
		}).
		state('createDestroy', {
			url: '/destroys/create',
			templateUrl: 'modules/destroys/views/create-destroy.client.view.html'
		}).
		state('viewDestroy', {
			url: '/destroys/:destroyId',
			templateUrl: 'modules/destroys/views/view-destroy.client.view.html'
		}).
		state('editDestroy', {
			url: '/destroys/:destroyId/edit',
			templateUrl: 'modules/destroys/views/edit-destroy.client.view.html'
		});
	}
]);