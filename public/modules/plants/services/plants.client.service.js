'use strict';

//Plants service used to communicate Plants REST endpoints
angular.module('plants').factory('Plants', ['$resource',
	function($resource) {
		return $resource('plants/:plantId', { plantId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);