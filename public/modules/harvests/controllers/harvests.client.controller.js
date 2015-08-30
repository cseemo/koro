'use strict';

// Harvests controller
angular.module('harvests').controller('HarvestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Harvests', 'Plants', '$http', 'Destroys', 
	function($scope, $stateParams, $location, Authentication, Harvests, Plants, $http, Destroys) {
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

		//Mark the plant as weighedIn
		var finalWeighIn = function(plants, harvest, callback){
			console.log('Marking this plant as weighed in...', plants);
			$http({
									method: 'post',
									
									url: '/finalWeighIn', 
									data: {
										'plants': plants,
										'harvest': harvest
										
										},
												
										})
									.success(function(data, status) {
										console.log(data);
										callback();

							}).error(function(err, status) {
										console.log('Error: ', err);
										callback();

							});
		};

		$scope.chooseAPlantToHarvest = function(stuff, ourPlant){
			console.log('Pull PLant from Available Plants....: ', ourPlant);
			console.log('Stuff: ', stuff);

			ourPlant.plantId = this.ourPlantId.plantId;
			ourPlant.plantObjectId = stuff._id;
			// console.log('Remove this plant from available plants...', row);

			// var x = $scope.allOurReadyToHarvest.indexOf(plant);
			// 	if(x != -1){
			// 		console.log('Found our plant....');
			// 		console.log(plant);
			// 		$scope.allOurReadyToHarvest.splice(x,1);
			// 		console.log('# of Available Plants: ', $scope.allOurReadyToHarvest.length);

			// 	}else{
			// 		console.log('PLant not in our available harvests...');
			// 		// console.log(item);
			// 	}

			var i = 0;
			angular.forEach($scope.allOurReadyToHarvest, function(plant){
				console.log('Plant info...', plant._id);
				var x = $scope.allOurReadyToHarvest.indexOf(plant);
				console.log('X=', x);
				if(stuff._id===plant._id){
					console.log('Found our plant....');
					console.log(plant);
					
					$scope.allOurReadyToHarvest.splice(i,1);
					console.log('# of Available Plants: ', $scope.allOurReadyToHarvest.length);

				}else{
					console.log('PLant not in our available harvests...');
					// console.log(item);
				}
				i++;

			})
			// // console.log($scope.allOurReadyToHarvest[row]);
			// // var plant = $scope.allOurReadyToHarvest[row];
			// // $scope.allOurReadyToHarvest.splice(row, 1);
			ourPlant.hideTheOptions = true;
			return ourPlant.IdDone = true;
			
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

    //Update the Waste Log
    var updateWasteLog = function(weights, myPlant, stage){

    	console.log('Adding to our destroy log');
			console.log(weights);
			console.log(myPlant);
			console.log(stage);
			console.log('That is the data we got....');
			console.log('Do we have plant Id?? ', myPlant.plantId);

			var destroy = new Destroys ({
				user: $scope.authentication.user._id,
				strain: myPlant.strain,
				methodOfDestruction: 'Mulch',
				reasonToDestroy: 'Waste',
				weight: weights.wasteWeight,
				type: 'Waste',
				plantId: myPlant.plantId,
				roomId: myPlant.roomId

			});

			// Redirect after save
			destroy.$save(function(response) {
				console.log('Saved Destruction...', response);
			});

    };


    $scope.saveTrim = function(weights, myPlant, stage){
    	console.log('Saveing', myPlant);
    	console.log('Weights', weights);
    	console.log('Stage: ', stage);
    	console.log('Plant Resource??? ', $scope.plantToTrim);
    	Plants.get({plantId: myPlant._id}).$promise.then(function(plant){
    		console.log('Plants...', plant);
    		updateWasteLog(weights, myPlant, stage);
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
    	console.log('Gotta go thru '+$scope.harvest.plants.length+' plants in this harvest...');
    	var harvestTotalWeight = 0;
    	var totalGoodWeight = 0;
    	$scope.harvest.aBudsWeight = 0;
    	$scope.harvest.bBudsWeight = 0;
    	$scope.harvest.cBudsWeight = 0;
    	$scope.harvest.trimWeight = 0;
    	$scope.harvest.wasteWeight = 0;

    	var plantsToFix = [];
    	angular.forEach($scope.harvest.plants, function(plant){
    		console.log('Plant...', plant._id);
    		// console.log(plant);
    		$scope.harvest.harvestTotalWeight=parseFloat(harvestTotalWeight)+parseFloat(plant.aBudsWeight)+parseFloat(plant.bBudsWeight)+parseFloat(plant.wasteWeight)+parseFloat(plant.trimWeight);
			$scope.harvest.totalGoodWeight = parseFloat(totalGoodWeight)+parseFloat(plant.aBudsWeight)+parseFloat(plant.bBudsWeight);
    		$scope.harvest.aBudsWeight = parseFloat($scope.harvest.aBudsWeight)+parseFloat(plant.aBudsWeight);
    		$scope.harvest.bBudsWeight = parseFloat($scope.harvest.bBudsWeight)+parseFloat(plant.bBudsWeight);
    		// $scope.harvest.cBudsWeight = parseFloat($scope.harvest.cBudsWeight)+parseFloat(plant.cBudsWeight);
    		$scope.harvest.trimWeight = parseFloat($scope.harvest.trimWeight)+parseFloat(plant.trimWeight);
    		$scope.harvest.wasteWeight = parseFloat($scope.harvest.wasteWeight)+parseFloat(plant.wasteWeight);
    		plantsToFix.push(plant);
    		plant.plantWeighIn = Date.now();

    		var weights = {
    			wasteWeight: plant.wasteWeight
    		};

    		updateWasteLog(weights, plant, 'Harvest');
    		
    	});



    		$scope.harvest.harvestEnd =Date.now();
    	$scope.harvest.$update(function(){

    		finalWeighIn(plantsToFix, $scope.harvest, function(err, resp){
    			 $location.path('/harvests');
    		});
    		
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