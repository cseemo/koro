'use strict';

// Plants controller
angular.module('plants').controller('PlantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plants',
	function($scope, $stateParams, $location, Authentication, Plants) {
		$scope.authentication = Authentication;

		// Create new Plant
		$scope.create = function() {
			// Create new Plant object
			var plant = new Plants ({
				name: this.name
			});

			// Redirect after save
			plant.$save(function(response) {
				$location.path('plants/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Plant
		$scope.remove = function(plant) {
			if ( plant ) { 
				plant.$remove();

				for (var i in $scope.plants) {
					if ($scope.plants [i] === plant) {
						$scope.plants.splice(i, 1);
					}
				}
			} else {
				$scope.plant.$remove(function() {
					$location.path('plants');
				});
			}
		};

		// Update existing Plant
		$scope.update = function() {
			var plant = $scope.plant;

			plant.$update(function() {
				$location.path('plants/' + plant._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Plants
		$scope.find = function() {
			$scope.plants = Plants.query();
		};

		// Find existing Plant
		$scope.findOne = function() {
			$scope.plant = Plants.get({ 
				plantId: $stateParams.plantId
			});
		};
	}
]);