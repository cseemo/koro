'use strict';

//Offenders service used to communicate Offenders REST endpoints
angular.module('offenders').factory('Offenders', ['$resource',
	function($resource) {
		return $resource('offenders/:offenderId', { offenderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);