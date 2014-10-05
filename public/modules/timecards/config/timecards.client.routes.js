'use strict';

//Setting up route
angular.module('timecards').config(['$stateProvider',
	function($stateProvider) {
		// Timecards state routing
		$stateProvider.
		state('listTimecards', {
			url: '/timecards',
			templateUrl: 'modules/timecards/views/list-timecards.client.view.html'
		}).
		state('createTimecard', {
			url: '/timecards/create',
			templateUrl: 'modules/timecards/views/create-timecard.client.view.html'
		}).
		state('viewTimecard', {
			url: '/timecards/:timecardId',
			templateUrl: 'modules/timecards/views/view-timecard.client.view.html'
		}).
		state('updateTimecard', {
			url: '/awesome/clock',
			templateUrl: 'modules/timecards/views/view-timecard.client.view.html'
		}).
		state('editTimecard', {
			url: '/timecards/:timecardId/edit',
			templateUrl: 'modules/timecards/views/edit-timecard.client.view.html'
		}).
		state('dayTimecard', {
			url: '/timecards/byday',
			templateUrl: 'modules/timecards/views/view-timecard.client.view.html'
		}).
		state('lastShift', {
			url: '/awesome/lastshift',
			templateUrl: 'modules/timecards/views/view-timecard.client.view.html'
		});


		
	}
]);