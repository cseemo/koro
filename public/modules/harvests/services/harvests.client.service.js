'use strict';

//Harvests service used to communicate Harvests REST endpoints
angular.module('harvests').factory('Harvests', ['$resource',
	function($resource) {
		return $resource('harvests/:harvestId', { harvestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);