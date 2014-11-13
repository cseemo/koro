'use strict';

//Setting up route
angular.module('workorders').config(['$stateProvider',
	function($stateProvider) {
		// Workorders state routing
		$stateProvider.
		state('listWorkorders', {
			url: '/workorders',
			templateUrl: 'modules/workorders/views/list-workorders.client.view.html'
		}).
		state('createWorkorder', {
			url: '/workorders/create',
			templateUrl: 'modules/workorders/views/create-workorder.client.view.html'
		}).
		state('viewWorkorder', {
			url: '/workorders/:workorderId',
			templateUrl: 'modules/workorders/views/view-workorder.client.view.html'
		}).
		state('editWorkorder', {
			url: '/workorders/:workorderId/edit',
			templateUrl: 'modules/workorders/views/edit-workorder.client.view.html'
		});
	}
]);