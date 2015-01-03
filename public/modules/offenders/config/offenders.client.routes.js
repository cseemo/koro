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
		state('shopView', {
			url: '/customer/:offenderId',
			templateUrl: 'modules/offenders/views/view-offender.shop.view.html'
		}).
		state('shopViewPending', {
			url: '/pending',
			templateUrl: 'modules/offenders/views/list-pendingorders.shop.view.html'
		}).
		state('editOffender', {
			url: '/offenders/:offenderId/edit',
			templateUrl: 'modules/offenders/views/edit-offender.client.view.html'
		}).
		state('lookUpCustomer', {
			url: '/lookUpCustomer',
			templateUrl: 'modules/offenders/views/view-lookupcustomer.shop.view.html'
		});



		
	}
]);