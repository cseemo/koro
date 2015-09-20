'use strict';

// Clones controller
angular.module('clones').controller('ClonesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clones', '$http', 'Plants', 'Destroys',  
	function($scope, $stateParams, $location, Authentication, Clones, $http, Plants, Destroys) {
		$scope.authentication = Authentication;
		$scope.newClones = [];
		$scope.clonesToUpdate = [];

		// Create new Clone
		$scope.create = function() {
			// Create new Clone object
			var clone = new Clones ({
				name: this.name,
				user: $scope.authentication.user._id,
				motherId: this.motherId,
				boxId: this.boxId,
				puckLocation: this.puckLocation,
				strain: this.strain
			});

			// Redirect after save
			clone.$save(function(response) {
				// $location.path('clones/' + response._id);
				$scope.puckLocation='';
				$scope.newClones.push(response);
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//Get our Box Ids from All of our Clones
		$scope.getCloneBoxes = function(){
			console.log('Get our Box Ids....');
			var path = $location.$$path;
    		var stage = 1;
    		if(path==='/clones/transfer1'){
    			stage = 1;
    			$scope.getQty = 'box.stage1';
    		}
    		if(path==='/clones/transfer2'){
    			stage = 2;
    			$scope.getQty = 'box.stage2';
    		}

			$http({
				method: 'get',
				url: '/getCloneBoxIds?stage='+stage, 
				
					})
				.success(function(data, status) {
					console.log('Clone Box IDs: ', data);
					$scope.cloneBoxes = data;
					$scope.cloneMommy = data[0];
			});

		};

		//Create New Clones from Existing Mother
		$scope.makeClonesFromMom = function(){
			console.log('Making clones....');
			$scope.readyToCreate = true;
			$scope.motherId =  $scope.cloneMommy.plantId;
			$scope.strain = $scope.cloneMommy.strain;
		};

		//Get Clones w/ this Box ID
		$scope.chooseClones = function(boxId){
			console.log('Box ID...');
			console.log($location.$$path);
    		var path = $location.$$path;
    		var query;
    		if(path==='/clones/transfer1'){
    			console.log('Transferring to 16oz Cups');
    			query = {boxId: boxId._id, activeClone: true, inCup: false};
    			$scope.stage = 1;
    		}else{
    			console.log('Transferring to 3 Gallon Buckets');
    			query = {boxId: boxId._id, activeClone: true, inCup: true};
    			$scope.stage = 2;

    		}


			$scope.clones = Clones.query(query);
			$scope.clones.$promise.then(function(){
				console.log('Got the clones in box id', boxId);
				console.log('A total of '+$scope.clones.length);
			});
		};

		//Create a Plant from a Clone
		var newPlant = function(type, clone, callback){
			console.log('Creating a new Plant:', type);
			console.log('Out of: ', clone);	
			var inProduction = false,
				isMother = false;

			if(type==='mother') isMother = true;
			if(type==='production') inProduction = true;

			var plant = new Plants ({
				clone: clone._id,
				motherId: clone._id,
				strain: clone.strain,
				inProduction: inProduction,
				isMother: isMother,

			});

			// Redirect after save
			plant.$save(function(response) {
				callback(response);

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});



		};
		//Transfer Clones
		$scope.transferClone = function(clone, transferType){
			console.log(transferType+' '+clone._id);
			if(transferType==='destroy'){
				clone.destroy = true;
				clone.action = 'Destroy'
			}
			if(transferType==='16ozCup'){
				clone.action = '16ozCup';
				clone.inCup = true;
			}
			if(transferType==='production'){
				clone.destroy = false;
				clone.destroyMethod = null;
				clone.action = 'Production'
				
				newPlant('production', clone, function(newPlant){
					console.log('Our New Plant: ', newPlant);
					clone.plantId = newPlant._id;
					clone.plant_Id = newPlant._id;
					clone.needPlantId = true;

				});
				clone.activeClone = false;
			clone.transferDate = Date.now();
			}
			if(transferType==='mother'){
				clone.destroy = false;
				clone.destroyMethod = null;
				clone.action = 'Mother'
				newPlant('mother', clone, function(newPlant){
					console.log('Our New Plant: ', newPlant);
					clone.plantId = newPlant._id;
					clone.plant_Id = newPlant._id;
					clone.needPlantId = true;
				});
				clone.activeClone = false;
			clone.transferDate = Date.now();
				
			}
			
			$scope.clonesToUpdate.push(clone);
		};

		$scope.destroyReasons = ['Not a Viable Plant', 'Bugs', 'Rot', 'Mold/Mildew', 'Waste', 'Contaminated'];
		$scope.destroyMethods = ['Mulch', 'Burn Out Front', 'Toilet', 'Garbage Disposal'];
		// $scope.methodToDestroy = $scope.destroyMethods[0];

		$scope.changeDestructionMethod = function(row, clone){
			console.log('Changing Destruction Method to : ', $scope.destroyMethod);
			console.log('Test: ', $scope.clone);
			console.log('Clone: ', clone);
			// $scope.clones[row]['destroyMethod'] = 'Test';
			clone.destroyed = true;
			
			// clone.$update();
			clone.destroyedBy = $scope.authentication.user._id;
			return clone;
			// clone.destroyMethod = $scope.methodToDestroy ;
			
		};

		var updatePlantId = function(plant_Id, plantId, roomId){
			console.log('updating plant id...');
			Plants.get({plantId: plant_Id}).$promise.then(function(plant){
				console.log('Got the plant...');
				plant.plantId = plantId;
				plant.roomId = roomId;
				console.log('Plant to save...', plant);
				plant.$update();
			})

		};

		var addToDestroyLog = function(type, strain, weight, reason, destructionMethod, plantId, roomId){
			console.log('Adding to our destroy log');
			console.log('Type: ', type);
			console.log('Weight: ', weight);

			var destroy = new Destroys ({
				user: $scope.authentication.user._id,
				strain: strain,
				methodOfDestruction: destructionMethod,
				reasonToDestroy: reason,
				weight: weight,
				type: type,
				plantId: plantId,
				roomId: roomId

			});

			// Redirect after save
			destroy.$save(function(response) {
				console.log('Saved Destruction...', response);
			});

		};


		//Save the box info of each of the clones
		$scope.saveBoxInfo = function(){

			console.log('Clones: ', $scope.clonesToUpdate);
			var i =0;
			 angular.forEach($scope.clonesToUpdate, function(clone){
			 	console.log('Clone: ', clone);
			 	if(clone.plantId){
			 		console.log('This is a new plant...lets update the plant id');
			 		updatePlantId(clone.plant_Id, clone.plantId, clone.roomId);
			 		if(clone.plantId===clone.plant_Id){
			 			console.log('All good....');
			 			
			 		}else{
			 			console.log("Gotta override the pLantID");
			 			console.log(clone.plantId);
			 			console.log(clone.plant_Id);
			 			
			 		}
			 	}
			 	if(clone.action==='16ozCup'){
			 		clone.active = true;
			 		clone.inCup = true;
			 	}else{
			 		clone.active = false;
			 	}

			 	if(clone.destroy===true){
			 		console.log('Gotta destroy ', clone);
			 		clone.activeClone = false;
			 		addToDestroyLog('clone', clone.strain, 'Entire Clone', clone.destroyReason, clone.destroyMethod, clone._id, 'Box ID: '+clone.boxId);

			 	}
			 	
			 	clone.$update(function(){
			 		i++;
			 		if(i===$scope.clonesToUpdate.length){
			 			console.log('Finished w plants...');
			 			$scope.stage = 0;
			 			$scope.getCloneBoxes();
			 		}
			 	});

			 });


		};
		// Remove existing Clone
		$scope.remove = function(clone) {
			if ( clone ) { 
				clone.$remove();

				for (var i in $scope.clones) {
					if ($scope.clones [i] === clone) {
						$scope.clones.splice(i, 1);
					}
				}
			} else {
				$scope.clone.$remove(function() {
					$location.path('clones');
				});
			}
		};

		// Update existing Clone
		$scope.update = function() {
			var clone = $scope.clone;

			clone.$update(function() {
				$location.path('clones/' + clone._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Clones
		$scope.find = function() {
			$scope.clones = Clones.query();
		};

		// Find existing Clone
		$scope.findOne = function() {
			$scope.clone = Clones.get({ 
				cloneId: $stateParams.cloneId
			});
		};

		//Get All Plants that are Mothers
		$scope.getMommys = function(){
			console.log('Get the moms');
			Plants.query({isMother: true}).$promise.then(function(moms){
				console.log('Got the mommms....', moms);
				$scope.allOurMothers = moms;
			});

		};
	}
]);