'use strict';

// Dispensaries controller
angular.module('dispensaries').controller('DispensariesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dispensaries', '$http', 
	function($scope, $stateParams, $location, Authentication, Dispensaries, $http) {
		$scope.authentication = Authentication;


		$scope.getDispSpecials = function(){
			var id = $stateParams.dispensaryId;

			console.log('Get Special for this disp...', id);
			
			console.log('ID: ', id);

					var specials = $http({
					method: 'get',
					url: '/getSpecials?dispID='+id, 
					
						})
					.success(function(data, status) {
						console.log('Speicals: ', data);
					
						$scope.specials = data;
					}).error(function(data, status) {
						console.log('Error: ', data);
						$scope.error = true;
						$scope.errorMessage = data;
						
					});

		};

				$scope.getSpecials = function(){

			console.log('Getting Specials');
			
			var specials = $http({
					method: 'get',
					url: '/getSpecials', 
					
						})
					.success(function(data, status) {
						console.log('Speicals: ', data);
					
						$scope.specials = data;
					}).error(function(data, status) {
						console.log('Error: ', data);
						$scope.error = true;
						$scope.errorMessage = data;
						
					});


		};


		$scope.isCollapsed = true;

		$scope.addURL = function(){
			console.log($scope);
			console.log('Adding a New URL');

		};

		// Create new Dispensary
		$scope.create = function() {
			console.log(this.name);
			console.log(this.url);
			// Create new Dispensary object
			var dispensary = new Dispensaries ({
				name: this.name, 
				url: this.url
			});

			// Redirect after save
			dispensary.$save(function(response) {
				$location.path('dispensaries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dispensary
		$scope.remove = function(dispensary) {
			if ( dispensary ) { 
				dispensary.$remove();

				for (var i in $scope.dispensaries) {
					if ($scope.dispensaries [i] === dispensary) {
						$scope.dispensaries.splice(i, 1);
					}
				}
			} else {
				$scope.dispensary.$remove(function() {
					$location.path('dispensaries');
				});
			}
		};

		// Update existing Dispensary
		$scope.update = function() {
			var dispensary = $scope.dispensary;

			dispensary.$update(function() {
				$location.path('dispensaries/' + dispensary._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dispensaries
		$scope.find = function() {
			$scope.dispensaries = Dispensaries.query();
		};

		// Find existing Dispensary
		$scope.findOne = function() {
			$scope.dispensary = Dispensaries.get({ 
				dispensaryId: $stateParams.dispensaryId
			});
		};
	}
]);