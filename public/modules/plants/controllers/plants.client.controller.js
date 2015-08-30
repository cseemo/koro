'use strict';

// Plants controller
angular.module('plants').controller('PlantsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Plants', '$modal', 
	function($scope, $stateParams, $location, Authentication, Plants, $modal) {
		$scope.authentication = Authentication;

				 //Table Stuff

  $scope.tableData = {
      searchKeywords: '',
    };
    $scope.filteredPlants= [];
    $scope.row = '';
    $scope.numPerPageOpt = [10, 20, 50, 100, 250, 500];
    $scope.numPerPage = $scope.numPerPageOpt[0];
    $scope.currentPage = 1;
    //$scope.currentPageDeals= $scope.getinit;
    $scope.currentPagePlants= [];



    $scope.select = function(page) {
       
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
    
      $scope.currentPage = page;
      $scope.currentPagePlants = $scope.filteredPlants.slice(start, end);
      
    
    return $scope.currentPagePlants;


    };

    $scope.onFilterChange = function() {
      $scope.select(1);
      $scope.currentPage = 1;
      return $scope.row = '';
    };
    $scope.onNumPerPageChange = function() {
      $scope.select(1);
      return $scope.currentPage = 1;
    };
    $scope.onOrderChange = function() {
      $scope.select(1);
      return $scope.currentPage = 1;
    };
    $scope.search = function() {
      
      $scope.filteredPlants = $filter('filter')($scope.Plants, $scope.tableData.searchKeywords);

      return $scope.onFilterChange();
    };

     $scope.searchPending = function() {
      ////////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredPlants = $filter('filter')($scope.Plants, $scope.tableData.searchKeywords);

      // {companyname: $scope.tableData.searchKeywords},

      /*$scope.filteredRegistrations = $filter('filter')($scope.registrations, {
        firstName: $scope.searchKeywords,
        lastName: $scope.searchKeywords,
        confirmationNumber: $scope.searchKeywords,
      });*/
      return $scope.onFilterChange();
    };


    $scope.order = function(rowName) {
      //console.log('Reordering by ',rowName);
      ////////////////console.log('Scope.row ', $scope.row);
      if ($scope.row === rowName) {
        return;
      }
      $scope.row = rowName;
      $scope.filteredPlants = $filter('orderBy')($scope.filteredPlants, rowName);
      ////////////////console.log(rowName);
      return $scope.onOrderChange();
    };

    // $scope.setCurrentOffender = function(ind) {
    //   $scope.currentDevice = $scope.filteredPlants.indexOf(ind);
    // };

    $scope.init = function() {
      console.log('Getting Plants');
 	  Plants.query().$promise.then(function(plants){
 			console.log('Found '+plants.length+'...');
 			console.log(plants);
 			$scope.Plants = plants;
 			$scope.filteredPlants = plants;
 			return $scope.select($scope.currentPage);
 		})
      //  $http({
      //     method: 'get',
      //     url: '/allOfOurPlants',
      //     })
      //     .success(function(data, status) {
      //       console.log('Got all of the Plants WITH the shop data and client name!!!');
      //       console.log(data);
      //    $scope.Plants = data;
      //     $scope.filteredPlants = data;
      //    return $scope.select($scope.currentPage);
      // }).error(function(err){
      //   console.log(err);

      // });
      
  

    };


    //Open Up Modal to View Plant
    $scope.plantView = function(plant){
    	console.log('Viewing plant...', plant);
    	 var modalInstance;
     modalInstance = $modal.open({
         templateUrl: 'plantModal.html',
          controller: function($scope, $modalInstance, user, plant, $timeout, $filter, socket){
           
            $scope.user = user;
            $scope.plant = plant;
            

            $scope.save = function(type){
              console.log('Updating Task...', type);
              console.log($scope.plant);
              if(type==='mother'){
                $scope.plant.isMother = true;
                 $scope.plant.inProduction = false;

              }
              if(type==='production'){
                 $scope.plant.isMother = false;
                 $scope.plant.inProduction = true;
                
              }
              if(type==='destroy'){
                 $scope.plant.isMother = false;
                 $scope.plant.inProduction = false;
                
              }
                $scope.plant.$update(function(){
                    $modalInstance.close($scope.plant);
                })
              

              // if(type==='complete'){
              //   console.log('This task is complete...');
              //   task.complete = Date.now();
              //   task.completionNotes = $scope.notes;
              //   task.status = 'Pending Review';
              //   task.$update(function(){
              //     console.log("Done updtaeing the task...");
              //     console.log(task);
              //     $modalInstance.close();

              //   })
              // }else{
              //   console.log('Order not complete...');
              //   task.completionNotes = $scope.notes;
              //   task.status = 'Pending Review';
              //   task.$update(function(){
              //     console.log("Done updtaeing the task...");
              //     console.log(task);
              //     $modalInstance.close();

              //   })
              // }

               

            };

            $scope.close = function(){
              console.log('Closing Modal');
              $modalInstance.dismiss('Closed');
            };
          },
          resolve: { 
            user: function() {
              return $scope.authentication.user
            }, 
            plant: function() {
              return plant
            },
            
             
          }
        });


        modalInstance.result.then(function(result) {
          console.log('Modal finished..', result);
          
  
          
        }, function() {
          
          console.log('Modal dismissed at: ' + new Date());
        });

    };


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