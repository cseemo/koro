'use strict';

//Clones service used to communicate Clones REST endpoints
angular.module('clones').factory('Clones', ['$resource',
	function($resource) {
		return $resource('clones/:cloneId', { cloneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);