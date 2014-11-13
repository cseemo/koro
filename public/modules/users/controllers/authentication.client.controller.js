'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Users', 'socket', 
	function($scope, $http, $location, Authentication, Users, socket) {
	   $scope.authentication = Authentication;
  //If a socket call comes for this user Fire off a toastr event
    socket.on($scope.authentication.user._id, function(data) {
        console.log('Socket Data for specific user : %o', $scope.authentication.user);
        toastr.info(data.deal+' just signed their LOAs!!');     
        });

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				//If successful we assign the response to the global user model
				$scope.authentication.user = response;


				$http.post('/email/'+$scope.authentication.user._id+'/confirmation', $scope.authentication.user).success(function(mystuff){

					//console.log('Confirmation Email sent');
				});


				//And redirect to the index page
				////console.log('Sending to /email/confirmation');
				$location.path('/');


			}).error(function(response) {
				$scope.error = response.message;
			});
		};

			$scope.sendReset = function(){
					//console.log('Resetting Password');
					var username = $scope.usertoReset;
					$http.get('/forgot_password/'+username).success(function(response){
						//console.log('email sent',response);
					});


				};

			//Set New Password Upon Reset
			$scope.setNewPW = function(){
			//console.log('Setting New Password');
			if($scope.resetPasswordForm.newpw===$scope.resetPasswordForm.confirmpw){
				//$scope.mylocation = $routeParams.userId;
			$scope.success = $scope.error = null;
			//console.log('Scope: %o',$scope);
			////console.log($location);
			$http({
				method: 'post', 
				url: $location.$$url,
				data: { pw: $scope.newpw
			},
			})
		.success(function(data, status) {
	
				// If successful show success message and clear form
				$scope.resetPasswordForm.newpw=null;
				$scope.resetPasswordForm.confirmpw=null;
				$scope.success = true;
				$scope.passwordDetails = null;
				//console.log('Done baby!!!');
				//$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		}else{
			window.alert('Passwords do not match');
		}


				};


		$scope.signin = function() {
			console.log('Signing In', $scope.credentials);
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				//If successful we assign the response to the global user model
				$scope.authentication.user = response;
				// socket.emit('message', {type: 'signing', user: $scope.authentication.user.displayName});
				
				//And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

			// Find existing Deal
		$scope.findOne = function() {
			//console.log('Getting a User');
			$scope.user = Users.get({ 
				userId: $stateParams.userId

			});
			//console.log('Deal Info: %o', $scope.user);
			

			
		};
	}
]);