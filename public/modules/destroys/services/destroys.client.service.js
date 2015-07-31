'use strict';

//Destroys service used to communicate Destroys REST endpoints
angular.module('destroys').factory('Destroys', ['$resource',
	function($resource) {
		return $resource('destroys/:destroyId', { destroyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);