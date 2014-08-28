'use strict';

//Deals service used to communicate Deals REST endpoints
angular.module('deals').factory('Deals', ['$resource',
	function($resource) {
		return $resource('deals/:dealId', { dealId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);