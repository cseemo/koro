'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', 'uiGmapGoogleMapApi', 
	function($scope, Authentication, $location, uiGmapGoogleMapApi) {
		// uiGmapGoogleMapApi 'uiGmapGoogleMapApi',
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/signin');


		uiGmapGoogleMapApi.then(function(maps) {
   
          $scope.map = {center: {latitude: 51.219053, longitude: -94 }, zoom: 5 };
        	$scope.options = {scrollwheel: false};
 

    });
 
       
    }]);

