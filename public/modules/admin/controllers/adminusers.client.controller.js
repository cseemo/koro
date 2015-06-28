'use strict';

angular.module('admin').controller('AdminusersController', ['$scope', '$stateParams', 'Users',  '$location', 'Authentication', '$http', '$filter', 
	function($scope, $stateParams, Users, $location, Authentication, $http, $filter) {

		// Storage for our "switches" role type current condition (true or false)
		$scope.roles = {};


		
		// Find existing Deal
		$scope.findOne = function() {
			////console.log('MyScope at beginning %o', $scope);
			// //console.log('Finding One');
			////console.log('StateParam %o', $stateParams.userId);
			$scope.userB = Users.get({ 
				userId: $stateParams.userId
			}, function() {

				// Grab our roles, and move htem into our roles object for controlling our "switches"
				for(var i in $scope.userB.roles) {
					$scope.roles[$scope.userB.roles[i]] = true;
				}

		



			});

			$scope.userB = this.userB;
			

		};

		$scope.resetPW = function() {
				////console.log('Resetting PW',$scope.userB);
				var user_id = $scope.userB._id;
				var mydata = $scope.userB;

				$http.post('userspw/' + user_id + '/reset', mydata).success(function (data, status, headers){

					////console.log('Success', data);
					$location.path('/adminusers');
				});
		
				
		};

$scope.notify = function() {
////console.log('notify');
};
	

		// Find a list of Leads
		$scope.find = function() {
			////console.log('Finding');
			$scope.users = Users.query();
			////console.log('Scope %o', $scope);
		};


		// Update existing User
		$scope.updateUser = function() {

			// Clear our current roles list
			$scope.userB.roles = [];

			// Go through each role and if it is set to true add it to our array
			Object.keys($scope.roles).forEach(function(key){
				if($scope.roles[key]) {
					$scope.userB.roles.push(key);
				}
			});

			////console.log('Scope %o', $scope);
			//var userB = $scope.userB ;
			//var user = $scope.user;
			////console.log('Scope %o', $scope);
			$scope.userB.$update(function() {
				//$location.path('users/' + user._id + '/edit');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


	//User List Table Stuff

  $scope.tableData = {
      searchKeywords: '',
    };
    $scope.filteredUsers= [];
    $scope.row = '';
    $scope.numPerPageOpt = [3, 5, 10, 20];
    $scope.numPerPage = $scope.numPerPageOpt[2];
    $scope.currentPage = 1;
    //$scope.currentPageDeals= $scope.getinit;
    $scope.currentPageUsers= [];



    $scope.select = function(page) {
    	 
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
      //console.log('Start '+start+' and End '+end);
     
      //console.log('Filtered Users', $scope.filteredUsers);
      $scope.currentPage = page;
      $scope.currentPageUsers = $scope.filteredUsers.slice(start, end);
      // //console.log('Current Page Users', $scope.currentPageUsers);

      return $scope.currentPageUsers;


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
      // //console.log('Keywords: ', $scope.tableData.searchKeywords);
      // //console.log('Users; ', $scope.Users);
      $scope.filteredUsers = $filter('filter')($scope.users, $scope.tableData.searchKeywords);

      return $scope.onFilterChange();
    };

    //  $scope.searchPending = function() {
    //   ////////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
    //   $scope.filteredUsers = $filter('filter')($scope.pendingUsers, $scope.tableData.searchKeywords);

    //   // {companyname: $scope.tableData.searchKeywords},

    //   /*$scope.filteredRegistrations = $filter('filter')($scope.registrations, {
    //     firstName: $scope.searchKeywords,
    //     lastName: $scope.searchKeywords,
    //     confirmationNumber: $scope.searchKeywords,
    //   });*/
    //   return $scope.onFilterChange();
    // };


    $scope.order = function(rowName) {
    	// //console.log('Reordering by ',rowName);
    	// //console.log('Scope.row ', $scope.row);
      if ($scope.row === rowName) {
        return;
      }
      $scope.row = rowName;
      $scope.filteredUsers = $filter('orderBy')($scope.filteredUsers, rowName);
      ////////////////console.log(rowName);
      return $scope.onOrderChange();
    };
    $scope.setCurrentOffender = function(ind) {
      $scope.currentOffender = $scope.filteredUsers.indexOf(ind);
    };

    $scope.init = function() {
    	// //console.log('Getting Users');

    	$scope.users = Users.query();
    	$scope.users.$promise.then(function() {
				// $scope.search();
				// //console.log('Go our users');
				$scope.filteredUsers = $scope.users;



				// //console.log('Returning...');
				return $scope.select($scope.currentPage);
				});	
	

    };

		$scope.remove = function(userB) {
			if(!userB){
				var userB = $scope.userB;
			}
			userB.$promise.then(function(){


				//console.log('Attempting to Remove', userB);
				if (userB) {
					userB.$remove();

					for (var i in $scope.users) {
						if ($scope.users[i] === userB) {
							$scope.users.splice(i, 1);
						}
					}
				} else {
					$scope.userB.$remove(function() {
						$location.path('adminusers');
					});
				}
			});
			$location.path('adminusers');

			};


	}
]);