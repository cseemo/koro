'use strict';

//Dispensaries service used to communicate Dispensaries REST endpoints
angular.module('dispensaries').factory('Dispensaries', ['$resource',
	function($resource) {
		return $resource('dispensaries/:dispensaryId', { dispensaryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);