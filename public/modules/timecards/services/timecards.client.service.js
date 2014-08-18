'use strict';

//Timecards service used to communicate Timecards REST endpoints
angular.module('timecards').factory('Timecards', ['$resource',
	function($resource) {
		return $resource('timecards/:timecardId', { timecardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);