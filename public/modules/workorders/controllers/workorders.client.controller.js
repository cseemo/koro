'use strict';

// Workorders controller
angular.module('workorders').controller('WorkordersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workorders', 'Offenders', 
	function($scope, $stateParams, $location, Authentication, Workorders, Offenders ) {
		$scope.authentication = Authentication;

		// Create new Workorder
		$scope.create = function() {
			// Create new Workorder object
			var workorder = new Workorders ({
				name: this.name
			});

			// Redirect after save
			workorder.$save(function(response) {
				$location.path('workorders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Workorder
		$scope.remove = function( workorder ) {
			if ( workorder ) { workorder.$remove();

				for (var i in $scope.workorders ) {
					if ($scope.workorders [i] === workorder ) {
						$scope.workorders.splice(i, 1);
					}
				}
			} else {
				$scope.workorder.$remove(function() {
					$location.path('workorders');
				});
			}
		};

		// Update existing Workorder
		$scope.update = function() {
			var workorder = $scope.workorder ;

			workorder.$update(function() {
				$location.path('workorders/' + workorder._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workorders
		$scope.find = function() {
			$scope.workorders = Workorders.query();
		};

		// Find existing Workorder
		$scope.findOne = function() {
			$scope.workorder = Workorders.get({ 
				workorderId: $stateParams.workorderId
			});
			console.log('Found our Workorder Offender:  ', $scope.workorder);

				$scope.workorder.$promise.then(function(){

					console.log('Going after our OFfender');
					console.log('Found our Workorder Offender:  ', $scope.workorder.offender);


					var offender = Offenders.get({ 
				offenderId: $scope.workorder.offender
			});
					$scope.offender = offender;
				console.log('What did we get back..', $scope.offender);

			});
		};
	}
]);