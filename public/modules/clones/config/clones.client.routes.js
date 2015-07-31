'use strict';

//Setting up route
angular.module('clones').config(['$stateProvider',
	function($stateProvider) {
		// Clones state routing
		$stateProvider.
		state('listClones', {
			url: '/clones',
			templateUrl: 'modules/clones/views/list-clones.client.view.html'
		}).
		state('createClone', {
			url: '/clones/create',
			templateUrl: 'modules/clones/views/create-clone.client.view.html'
		}).
		state('transferClone1', {
			url: '/clones/transfer1',
			templateUrl: 'modules/clones/views/transfer-clone.client.view.html'
		}).
		state('transferClone2', {
			url: '/clones/transfer2',
			templateUrl: 'modules/clones/views/transfer-clone.client.view.html'
		}).
		state('viewClone', {
			url: '/clones/:cloneId',
			templateUrl: 'modules/clones/views/view-clone.client.view.html'
		}).
		state('editClone', {
			url: '/clones/:cloneId/edit',
			templateUrl: 'modules/clones/views/edit-clone.client.view.html'
		});
	}
]);