'use strict';

//Setting up route
angular.module('admin').config(['$stateProvider',
	function($stateProvider) {
		// Admin state routing
		$stateProvider.
		state('adminusers', {
			url: '/adminusers',
			templateUrl: 'modules/admin/views/useroverview.client.view.html'
		});
	}
]);