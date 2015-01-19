'use strict';

//Payments service used to communicate Payments REST endpoints
angular.module('payments').factory('Payments', ['$resource',
	function($resource) {
		return $resource('payments/:paymentId', { paymentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).service('portalPayments', ['$http', '$resource', 'Payments',  function($http, $resource, Payments){
	var paymentProfiles = [];
	var portalPayments = {};

	this.newPayment = function(wo, off){
		console.log('Runnign Payment Service');

		// console.log('Workorder: ', workorder);
		// var wo = workorder;
		console.log('This: ', this);



//Create New Payment
        		var pmt = new Payments ({
				workorder: wo._id,
				pmtType: wo.type,
				offender: off._id,
				status: 'Due',
				notes: 'Pending Workorder -- Payment Due', 
				amount: wo.amount
				
			});

        		
			// Redirect after save
			pmt.$save(function(response) {
					console.log('Response from saving PMT: ', response);

        		

   						wo.pmtStatus = 'Due';
   						wo.amount = wo.amount;
   						wo.$update();

   					});

			return pmt;

};

}]);
