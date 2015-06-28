'use strict';

// Harvests controller
angular.module('harvests').controller('HarvestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Harvests',
	function($scope, $stateParams, $location, Authentication, Harvests) {
		$scope.authentication = Authentication;


		$scope.newHarvest = function(){
			console.log('Generateing a new harvest...');
			$scope.harvest = {
				
			};
			localStorage.removeItem("Harvest");
		};

   $scope.listData = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

    $scope.dataCounter = 4;
    $scope.page = 1;


    $scope.harvestComplete = function(){
    	console.log('Harvest Complete');
    	$scope.harvest.harvestEnd =Date.now();
    	$scope.harvest.$update(function(){
    		$location.path('/harvests');
    	});
    };

    $scope.restoreMe = function(){
    	console.log('Gonna try and restore the harvest...');
    	var harvest = localStorage.getItem("Harvest");
    	$scope.harvest = JSON.parse(harvest);
    	console.log(harvest);
    };

    $scope.savePlant = function(plant, weight){
    	console.log('Saving Plant Info: ', plant);
    	if(weight){
    		plant.plantWeighIn = Date.now();
    		console.log('Plant Weighed in...');
    	}
    	// var harvest = JSON.stringify($scope.harvest);
    	// localStorage.setItem("Harvest", harvest);
    	
    	$scope.harvest.$update();

    };

    $scope.next = function(){
    	console.log('Going next...', $scope.harvest);
    	console.log($scope.harvest.roomID);
    	console.log('Need to create '+$scope.harvest.numberOfPlants+' new plants...');
    	var plants = [];
    	for(var i = 1; i <= $scope.harvest.numberOfPlants ; i++) {
					plants.push({number: i});
					////console.log('Addint Toll Free Details - Line 309', i);
				}
				$scope.harvest.plants = plants;
				console.log($scope.harvest);
    	$scope.page++;


    	var harvest = new Harvests ({
				name: $scope.harvest.name,
				roomID: $scope.harvest.roomID,
				numberOfPlants: $scope.harvest.numberOfPlants,
				plants: plants,
				harvestBegin: Date.now()
			});

			// Redirect after save
			harvest.$save(function(response) {
				// $location.path('harvests/' + response._id);
				console.log('Saved...complete!!');
				console.log(response);
				$scope.harvest = response;
				// Clear form fields
			
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


    };

    
   

		// Create new Harvest
		$scope.create = function() {
			// Create new Harvest object
			var harvest = new Harvests ({
				name: this.name
			});

			// Redirect after save
			harvest.$save(function(response) {
				$location.path('harvests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Harvest
		$scope.remove = function(harvest) {
			if ( harvest ) { 
				harvest.$remove();

				for (var i in $scope.harvests) {
					if ($scope.harvests [i] === harvest) {
						$scope.harvests.splice(i, 1);
					}
				}
			} else {
				$scope.harvest.$remove(function() {
					$location.path('harvests');
				});
			}
		};

		// Update existing Harvest
		$scope.update = function() {
			var harvest = $scope.harvest;

			harvest.$update(function() {
				$location.path('harvests/' + harvest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Harvests
		$scope.find = function() {
			$scope.harvests = Harvests.query();
			$scope.harvests.$promise.then(function(){
				console.log('Got our harvests...- figure out total Weight');
				var totalWeight = 0;
				angular.forEach($scope.harvests, function(harvest){
					console.log('Harvest...', harvest);
					angular.forEach(harvest.plants, function(plant){
					console.log('Plant...', plant);
					totalWeight=parseFloat(totalWeight)+parseFloat(plant.wetWeight);
					harvest.totalWetWeight = totalWeight;
				});

				});
			})
		};

		// Find existing Harvest
		$scope.findOne = function() {
			$scope.harvest = Harvests.get({ 
				harvestId: $stateParams.harvestId
			});
		};
	}
]);