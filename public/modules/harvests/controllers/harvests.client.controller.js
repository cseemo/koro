'use strict';

// Harvests controller
angular.module('harvests').controller('HarvestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Harvests', 'Plants', '$http', 
	function($scope, $stateParams, $location, Authentication, Harvests, Plants, $http) {
		$scope.authentication = Authentication;


		$scope.newHarvest = function(){
			console.log('Generateing a new harvest...');
			$scope.harvest = {
				
			};
			localStorage.removeItem("Harvest");


			
			    		$http({
				method: 'get',
				url: '/getReadyToHarvestPlants', 
				
					})
				.success(function(data, status) {
					console.log('Ready to Harvest Plants: ', data);
					$scope.allOurReadyToHarvest = data;
					
			});

		};

		$scope.hideOptions = function(plant){
			console.log('Hiding our options...');
			plant.hideTheOptions = true;
		};

		$scope.chooseAPlantToHarvest = function(row, plant){
			console.log('Plant: ', plant);
			plant.plantID = this.ourPlantId.plantId;
			console.log('Remove this plant from available plants...', row);
			console.log($scope.allOurReadyToHarvest[row]);
			var plant = $scope.allOurReadyToHarvest[row];
			$scope.allOurReadyToHarvest.splice(row, 1);
			return plant.IdDone = true;
			
		};

   $scope.listData = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

    $scope.dataCounter = 4;
    $scope.page = 1;


    $scope.init = function(){
    	console.log('INIT....');
    	console.log('Getting ready to trim...', $stateParams);
    	$scope.plant = {};
    	$scope.showWeights = false;

    	console.log($location.$$path);
    	var path = $location.$$path;
    	if(path==='/trimStage1') {
    		$scope.stage = 1;
    		$http({
				method: 'get',
				url: '/getStage1Plants', 
				
					})
				.success(function(data, status) {
					console.log('Clone Box IDs: ', data);
					$scope.plantsToTrim = data;
					
			});


    	}

    	if(path==='/trimStage2'){
    		$scope.stage = 2;
	    	$http({
				method: 'get',
				url: '/getStage2Plants', 
				
					})
				.success(function(data, status) {
					console.log('Stage 2 Plants: ', data);
					$scope.plantsToTrim = data;
					
			});

    	} 
    	if(path==='/trimStage3'){
    		$scope.stage = 3;
    		$http({
				method: 'get',
				url: '/getStage3Plants', 
				
					})
				.success(function(data, status) {
					console.log('Stage 3 Plants: ', data);
					$scope.plantsToTrim = data;
					
			});

    	} 


    };

    $scope.showOurWeights = function(){
    	console.log('Showing our weights');
    	$scope.showWeights = true;
    };

    $scope.saveTrim = function(weights, myPlant, stage){
    	console.log('Saveing', myPlant);
    	console.log('Weights', weights);
    	console.log('Stage: ', stage);
    	console.log('Plant Resource??? ', $scope.plantToTrim);
    	Plants.get({plantId: myPlant._id}).$promise.then(function(plant){
    		console.log('Plants...', plant);
    	
    	if(stage===1){
    		var myWeights = {
    			totalWeight: weights.wetWeight,
    			undefinedWeight: weights.undefinedWeight,
    			wasteWeight:  weights.wasteWeight
    		};

    		plant.stage1Trim.push(myWeights);
    		plant.stage1Complete = true;
    		plant.$update(function(savedPlant){
    			console.log('Svavedplant: ', savedPlant);
    			return $scope.init();
    		});

    	}
    	   if(stage===2){
    		var myWeights = {
    			totalWeight: weights.dryWeight,
    			undefinedWeight: weights.undefinedWeight,
    			wasteWeight:  weights.wasteWeight,
    			aBuds: weights.aBudsWeight,
    			bBuds: weights.bBudsWeight,
    			cBuds: weights.cBudsWeight,
    			trimWeight: weights.trimWeight
    		};

    		plant.stage2Trim.push(myWeights);
    		plant.stage2Complete = true;
    		plant.$update(function(savedPlant){
    			console.log('Svavedplant: ', savedPlant);
    			return $scope.init();
    		});

    	}

    	    	if(stage===3){
    		var myWeights = {
    			wasteWeight:  weights.wasteWeight,
    			aBuds: weights.aBudsWeight,
    			bBuds: weights.bBudsWeight,
    			cBuds: weights.cBudsWeight,
    			trimWeight: weights.trimWeight
    		};



    		plant.stage3Trim.push(myWeights);
    		plant.stage3Complete = true;
    		plant.$update(function(savedPlant){
    			console.log('Svavedplant: ', savedPlant);
    			return $scope.init();
    		});

    	}


    });



    };
    $scope.choosePlant = function(row){
    	console.log('Choosing Plant...', row);
    	console.log($scope.plantToTrim);

    };


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
				batchId: $scope.harvest.batchId,
				numberOfPlants: $scope.harvest.numberOfPlants,
				plants: plants,
				harvestBegin: Date.now(),
				user: $scope.authentication.user._id
			});

			// Redirect after saved
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