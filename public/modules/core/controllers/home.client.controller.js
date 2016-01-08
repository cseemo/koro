'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$location', 'uiGmapGoogleMapApi', '$http', 
	function($scope, Authentication, $location, uiGmapGoogleMapApi, $http) {
		// uiGmapGoogleMapApi 'uiGmapGoogleMapApi',
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/signin');
		$scope.action = false;
		$scope.moveCam = function(direction){
			console.log('Moving cam');
			var action; 
			var speed = 5;
			var code = direction;
			$scope.action = !$scope.action;
				if($scope.action) {
					action = 'start';
				}else{
					action = 'stop';
				}

				console.log('Action: ', action);

				action = 'start';

				var stopMove = function(){
					console.log('Stop movement...');
					action = 'stop';
				var makeCall2 =  window.open('http://admin:openDoor@192.168.0.105/cgi-bin/ptz.cgi?action='+action+'&channel=0&code='+code+'&arg1=0&arg2='+speed+'&arg3=0', 'Updating DND', "toolbar=no, scrollbars=no, resizable=yes, top=760, left=40, width=100, height=100");	
				
				setTimeout(function() {
			makeCall2.close();
				
			}, 250);
				


				}


			var makeCall = window.open('http://admin:openDoor@192.168.0.105/cgi-bin/ptz.cgi?action='+action+'&channel=0&code='+code+'&arg1=0&arg2='+speed+'&arg3=0', 'Updating DND', "toolbar=no, scrollbars=no, resizable=yes, top=760, left=40, width=100, height=100");	
			
			setTimeout(function() {
			makeCall.close();
				stopMove();
			}, 250);


			// $http({
			// 	method: 'GET',
			// 	url: 'http://admin:openDoor@192.168.0.105/cgi-bin/ptz.cgi?action=start&code=Left&arg1=0&arg2=1&arg3=0',
				


			// }).success(function(data){
			// 	console.log('Moved', data);
			// 	$scope.myImage = data;
			// }).error(function(err){
			// 	console.log('Error getting image', err);
			// })

		};

		$scope.getImage = function(){
			console.log('Gettin gimage...');

			// $scope.myImage = 'http://63.229.71.113/video/mjpg.cgi';
			$http({
				method: 'GET',
				url: 'admin:opendoor5@63.229.71.113/image/jpeg.cgi',
				responseType: "blob",


			}).success(function(data){
				console.log('Got an image', data);
				$scope.myImage = data;
			}).error(function(err){
				console.log('Error getting image', err);
			})
		};
	

		 
 
       
    }]);

