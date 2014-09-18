'use strict';

angular.module('admin').controller('AdminusersController', ['$scope', '$stateParams', 'Users',  '$location', 'Authentication', '$http',
	function($scope, $stateParams, Users, $location, Authentication, $http) {

		// Storage for our "switches" role type current condition (true or false)
		$scope.roles = {};

		// Find existing Deal
		$scope.findOne = function() {
			console.log('MyScope at beginning %o', $scope);

			console.log('StateParam %o', $stateParams.userId);
			$scope.userB = Users.get({ 
				userId: $stateParams.userId
			}, function() {

				// Grab our roles, and move htem into our roles object for controlling our "switches"
				for(var i in $scope.userB.roles) {
					$scope.roles[$scope.userB.roles[i]] = true;
				}
			});

			$scope.userB = this.userB;
			console.log('User Info: %o', $scope);
			console.log('This %o ', this);
		};

		$scope.resetPW = function() {
				console.log('Resetting PW',$scope.userB);
				var user_id = $scope.userB._id;
				var mydata = $scope.userB;

				$http.post('userspw/' + user_id + '/reset', mydata).success(function (data, status, headers){

					console.log('Success', data);
					$location.path('/adminusers');
				});
		
				
		};

$scope.notify = function() {
console.log('notify');
};
	

		// Find a list of Leads
		$scope.find = function() {
			console.log('Finding');
			$scope.users = Users.query();
			console.log('Scope %o', $scope);
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

			console.log('Scope %o', $scope);
			//var userB = $scope.userB ;
			//var user = $scope.user;
			console.log('Scope %o', $scope);
			$scope.userB.$update(function() {
				//$location.path('users/' + user._id + '/edit');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


	}
]);