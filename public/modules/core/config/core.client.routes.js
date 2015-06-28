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
			templateUrl: 'modules/core/views/home.client.view.html'
			/*templateUrl: function($stateParams) {
				console.log('stateparams: ', $stateParams.type);
				return 'modules/core/views/dashboard.client.view.html';
			}*/
		}).
		state('admin', {
			url: '/dashboard',
			templateUrl: 'modules/core/views/admin.client.view.html'
			/*templateUrl: function($stateParams) {
				console.log('stateparams: ', $stateParams.type);
				return 'modules/core/views/dashboard.client.view.html';
			}*/
		}).
		state('specials', {
			url: '/specials',
			templateUrl: 'modules/core/views/specials.client.view.html'
			
		}).
		state('lock', {
			url: '/lock',
			templateUrl: 'lock-screen.html'
			/*templateUrl: function($stateParams) {
				console.log('stateparams: ', $stateParams.type);
				return 'modules/core/views/dashboard.client.view.html';
			}*/
		});
	}
]);