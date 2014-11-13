'use strict';

//Workorders service used to communicate Workorders REST endpoints
angular.module('workorders').factory('Workorders', ['$resource',
	function($resource) {
		return $resource('workorders/:workorderId', { workorderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);