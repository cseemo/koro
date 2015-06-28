'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', 'uiGmapGoogleMapApi', '$http', 
	function($scope, Authentication, $location, uiGmapGoogleMapApi, $http) {
		// uiGmapGoogleMapApi 'uiGmapGoogleMapApi',
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/signin');


	

		 
 
       
    }]);

