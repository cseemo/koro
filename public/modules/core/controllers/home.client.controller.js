'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', 
	function($scope, Authentication, $location) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/signin');
	}
]);