'use strict';

//Leads service used to communicate Leads REST endpoints
angular.module('leads').factory('Leads', ['$resource',
	function($resource) {
		return $resource('leads/:leadId', { leadId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			getLeadsTypes: {
				method: 'GET',
				url: '/leads/stats/types'
			}
		});
	}
]);