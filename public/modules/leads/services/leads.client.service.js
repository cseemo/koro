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
			},
			getLeadTotalsByStatus: {
				method: 'GET',
				url: '/stats/leads/by/status',
				isArray: true,
			},
				getLeadTotalsByState: {
				method: 'GET',
				url: '/stats/leads/by/state',
				isArray: true,
			},

				getLeadTotalsByCarrier: {
				method: 'GET',
				url: '/stats/leads/by/carrier',
				isArray: true,
			},

				getDealsTotal: {
				method: 'GET',
				url: '/stats/deals/total',
				isArray: true,
			},


			
		});
	}
]);