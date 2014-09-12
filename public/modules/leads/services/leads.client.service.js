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

				getRevenueSold: {
				method: 'GET',
				url: '/stats/deals/mrctotal',
				isArray: true,
			},
				getCallsbyRep: {
				method: 'GET',
				url: '/records/calldetails/rep',
				isArray: true,
			}			
		});
	}
]);

angular.module('leads').factory('googleFactory', function ($q, $http) {
    return {

      getSearchResults: function () {
        var deferred = $q.defer(),
          host = 'https://ajax.googleapis.com/ajax/services/search/web',
          args = {
            'version': '1.0',
            'searchTerm': 'mean%20stack',
            'results': '8',
            'callback': 'JSON_CALLBACK'
          },
          params = ('?v=' + args.version + '&q=' + args.searchTerm + '&rsz=' +
            args.results + '&callback=' + args.callback),
          httpPromise = $http.jsonp(host + params);
 
        httpPromise.then(function (response) {
          deferred.resolve(response);
        }, function (error) {
          console.error(error);
        });
 
        return deferred.promise;
      }
    };
  });