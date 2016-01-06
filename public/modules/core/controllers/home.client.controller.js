'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', 'uiGmapGoogleMapApi', '$http', 
	function($scope, Authentication, $location, uiGmapGoogleMapApi, $http) {
		// uiGmapGoogleMapApi 'uiGmapGoogleMapApi',
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/signin');

		$scope.getImage = function(){
			console.log('Gettin gimage...');

			$scope.imageSrc = 'http://63.229.71.113/video/mjpg.cgi';
			// $http({
			// 	method: 'GET',
			// 	url: 'http://63.229.71.113/image/jpeg.cgi',
			// 	responseType: "blob",


			// }).success(function(data){
			// 	console.log('Got an image', data);
			// 	$scope.myImage = data;
			// }).error(function(err){
			// 	console.log('Error getting image', err);
			// })
		};
	

		 
 
       
    }]);

