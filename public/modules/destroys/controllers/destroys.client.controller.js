'use strict';

// Destroys controller
angular.module('destroys').controller('DestroysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Destroys',
	function($scope, $stateParams, $location, Authentication, Destroys) {
		$scope.authentication = Authentication;

		// Create new Destroy
		$scope.create = function() {
			// Create new Destroy object
			var destroy = new Destroys ({
				name: this.name
			});

			// Redirect after save
			destroy.$save(function(response) {
				$location.path('destroys/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Destroy
		$scope.remove = function(destroy) {
			if ( destroy ) { 
				destroy.$remove();

				for (var i in $scope.destroys) {
					if ($scope.destroys [i] === destroy) {
						$scope.destroys.splice(i, 1);
					}
				}
			} else {
				$scope.destroy.$remove(function() {
					$location.path('destroys');
				});
			}
		};

		// Update existing Destroy
		$scope.update = function() {
			var destroy = $scope.destroy;

			destroy.$update(function() {
				$location.path('destroys/' + destroy._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Destroys
		$scope.find = function() {
			$scope.destroys = Destroys.query();
		};

		// Find existing Destroy
		$scope.findOne = function() {
			$scope.destroy = Destroys.get({ 
				destroyId: $stateParams.destroyId
			});
		};
	}
]);