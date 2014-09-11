'use strict';

angular.module('admin').controller('AdminusersController', ['$scope', '$stateParams', 'Users',  '$location', 'Authentication',
	function($scope, $stateParams, Users, $location, Authentication) {
	

		// Find existing Deal
		$scope.findOne = function() {
			console.log('MyScope at beginning %o', $scope);

			console.log('StateParam %o', $stateParams.userId);
			$scope.userB = Users.get({ 
				userId: $stateParams.userId
			});

			$scope.userB = this.userB;
			console.log('User Info: %o', $scope);
			console.log('This %o ', this);

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
			console.log('Got here');

			console.log('Scope %o', $scope);
			var userB = $scope.userB ;
			//var user = $scope.user;
			console.log('Scope %o', $scope);
			userB.$update(function() {
				$location.path('users/' + user._id + '/edit');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


	}
]);