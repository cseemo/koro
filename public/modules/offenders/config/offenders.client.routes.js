'use strict';

//Setting up route
angular.module('offenders').config(['$stateProvider',
	function($stateProvider) {
		// Offenders state routing
		$stateProvider.
		state('listOffenders', {
			url: '/offenders',
			templateUrl: 'modules/offenders/views/list-offenders.client.view.html'
		}).
		state('createOffender', {
			url: '/offenders/create',
			templateUrl: 'modules/offenders/views/create-offender.client.view.html'
		}).
		state('viewOffender', {
			url: '/offenders/:offenderId',
			templateUrl: 'modules/offenders/views/view-offender.client.view.html'
		}).
		state('editOffender', {
			url: '/offenders/:offenderId/edit',
			templateUrl: 'modules/offenders/views/edit-offender.client.view.html'
		});
	}
]);