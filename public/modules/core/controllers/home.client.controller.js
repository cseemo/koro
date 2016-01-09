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
		$scope.speed = 5;
		$scope.camSpeed = 10;
		$scope.moving = false;

		$scope.changeSpeed = function(type){
			console.log('Changing Camera Speed...', $scope.speed);
			if(type==='slow'){
				$scope.speed = $scope.speed - 1;
				if($scope.speed < 2) $scope.speed = 1;


			}

			if(type==='fast'){
				$scope.speed = $scope.speed - 0+1;
				if($scope.speed > 9) $scope.speed = 10;
			}
		};

		$scope.moveCam = function(direction){
			console.log('Moving cam');
			
			var action; 
			var speed = 5
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

		$scope.moveDlinkCam = function(direction){
			console.log('Moving DLink Camera');
			var dir = 0;
			var panSpeed = $scope.speed*5;
			var tiltSpeed = $scope.speed*5;
			$scope.moving = true;

			if(direction==='Up') dir = 1;
			if(direction==='Down') dir = 7;
			if(direction==='Left') dir = 3;
			if(direction==='Right') dir = 5;

			var url = 'http://admin:opendoor6@63.229.71.113:81/pantiltcontrol.cgi?PanSingleMoveDegree='+panSpeed+'&TiltSingleMoveDegree='+tiltSpeed+'&PanTiltSingleMove='+dir;

			// var makeCall = window.open(url, 'Updating DND', "toolbar=no, scrollbars=no, resizable=yes, top=760, left=40, width=100, height=100");	
			
			// setTimeout(function() {
			// makeCall.close();
				
			// }, 3000);


			$http({
				method: 'POST',
				url: '/testMovement',
				data: {
					speed: panSpeed,
					direction: dir, 
					url: url
				}
		


			}).success(function(data){
				console.log('Moved...', data);
				$scope.moving = false;
			}).error(function(err){
				console.log('Error moving Dlink', err);
				$scope.moving = false;
			});

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

