'use strict';

//Setting up route
angular.module('plants').config(['$stateProvider',
	function($stateProvider) {
		// Plants state routing
		$stateProvider.
		state('listPlants', {
			url: '/plants',
			templateUrl: 'modules/plants/views/list-plants.client.view.html'
		}).
		state('createPlant', {
			url: '/plants/create',
			templateUrl: 'modules/plants/views/create-plant.client.view.html'
		}).
		state('viewPlant', {
			url: '/plants/:plantId',
			templateUrl: 'modules/plants/views/view-plant.client.view.html'
		}).
		state('editPlant', {
			url: '/plants/:plantId/edit',
			templateUrl: 'modules/plants/views/edit-plant.client.view.html'
		});
	}
]);