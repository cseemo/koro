'use strict';

// Destroys controller
angular.module('destroys').controller('DestroysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Destroys', '$filter', 
	function($scope, $stateParams, $location, Authentication, Destroys, $filter) {
		$scope.authentication = Authentication;


		 //Table Stuff

  $scope.tableData = {
      searchKeywords: '',
    };
    $scope.filteredDestroys= [];
    $scope.row = '';
    $scope.numPerPageOpt = [10, 20, 50, 100, 250, 500];
    $scope.numPerPage = $scope.numPerPageOpt[0];
    $scope.currentPage = 1;
    //$scope.currentPageDeals= $scope.getinit;
    $scope.currentPageDestroys= [];



    $scope.select = function(page) {
    	 
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
    
      $scope.currentPage = page;
      $scope.currentPageDestroys = $scope.filteredDestroys.slice(start, end);
      
		
		return $scope.currentPageDestroys;


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
      
      $scope.filteredDestroys = $filter('filter')($scope.Destroys, $scope.tableData.searchKeywords);

      return $scope.onFilterChange();
    };

     $scope.searchPending = function() {
      ////////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredDestroys = $filter('filter')($scope.Destroys, $scope.tableData.searchKeywords);

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
      $scope.filteredDestroys = $filter('orderBy')($scope.filteredDestroys, rowName);
      ////////////////console.log(rowName);
      return $scope.onOrderChange();
    };

    // $scope.setCurrentOffender = function(ind) {
    //   $scope.currentDevice = $scope.filteredDestroys.indexOf(ind);
    // };

    $scope.init = function() {
    	console.log('Getting Destroys');
 //    	$scope.Destroys = Destroys.query();

 		Destroys.query().$promise.then(function(destroys){
 			console.log('Found '+destroys.length+' destroys in our log...');
 			$scope.Destroys = destroys;
 			$scope.filteredDestroys = destroys;
 			return $scope.select($scope.currentPage);
 		})
 		  //  $http({
     //      method: 'get',
     //      url: '/allOfOurDestroys',
     //      })
     //      .success(function(data, status) {
     //        console.log('Got all of the Destroys WITH the shop data and client name!!!');
     //        console.log(data);
     //    	$scope.Destroys = data;
					// $scope.filteredDestroys = data;
     //    	return $scope.select($scope.currentPage);
     //  }).error(function(err){
     //    console.log(err);

     //  });
 			
	

    };


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