'use strict';

//Setting up route
angular.module('harvests').config(['$stateProvider',
	function($stateProvider) {
		// Harvests state routing
		$stateProvider.
		state('listHarvests', {
			url: '/harvests',
			templateUrl: 'modules/harvests/views/list-harvests.client.view.html'
		}).
		state('createHarvest', {
			url: '/harvests/create',
			templateUrl: 'modules/harvests/views/create-harvest.client.view.html'
		}).
		state('viewHarvest', {
			url: '/harvests/:harvestId',
			templateUrl: 'modules/harvests/views/view-harvest.client.view.html'
		}).
		state('stage1Trim', {
			url: '/trimStage1',
			templateUrl: 'modules/harvests/views/trim-client.view.html',
		}).
		state('stage2Trim', {
			url: '/trimStage2',
			templateUrl: 'modules/harvests/views/trim-client.view.html'
		}).
		state('stage3Trim', {
			url: '/trimStage3',
			templateUrl: 'modules/harvests/views/trim-client.view.html'
		}).
		state('editHarvest', {
			url: '/harvests/:harvestId/edit',
			templateUrl: 'modules/harvests/views/edit-harvest.client.view.html'
		});
	}
]);