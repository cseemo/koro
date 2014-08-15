'use strict';

angular.module('admin').controller('AdminusersController', ['$scope', 'Users', 
	function($scope, Users) {
	

$scope.notify = function() {

};
	

		// Find a list of Leads
		$scope.find = function() {
			$scope.users = Users.query();

		};



	}
]);