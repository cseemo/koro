'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/dashboard.client.view.html'
			/*templateUrl: function($stateParams) {
				console.log('stateparams: ', $stateParams.type);
				return 'modules/core/views/dashboard.client.view.html';
			}*/
		}).
		state('admin', {
			url: '/admin',
			templateUrl: 'modules/core/views/admin.client.view.html'
			/*templateUrl: function($stateParams) {
				console.log('stateparams: ', $stateParams.type);
				return 'modules/core/views/dashboard.client.view.html';
			}*/
		});
	}
]);