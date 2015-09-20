'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Users', 'socket', 
	function($scope, $http, $location, Authentication, Users, socket) {
	   $scope.authentication = Authentication;
  //If a socket call comes for this user Fire off a toastr event
    
		//If user is signed in then redirect back home
		if (!$scope.authentication.user) {
			console.log('User Not Logged in');
          var test = $location.path();
          test = test.substring(0,15);
          console.log('Test Path',test);

          if(test==='/forgot_passwor' || test==='/reset_password' || test==='/signup' || test==='/newshopsignup'){
            console.log('Resetting Password');
          	
          }else{
          	console.log('Please sign in');
          	$location.path('/signin');
		}
		}

		$scope.signup = function(io) {
			// console.log('Paramt', $location.absUrl());

			// console.log('Search Object', searchObject);
			if(io){
				if(io==='shop'){
					var shopId = $location.search()['shop'];
					$scope.credentials.isShop = true;
					$scope.credentials.shop = shopId;
				}
			}
			// console.log('Credentials: ', $scope.credentials);
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
					console.log('Resetting Password');
					var username = $scope.usertoReset;
					$http.get('/forgot_password/'+username).success(function(response){
						//console.log('email sent',response);
						$scope.success = true;
						$scope.message = 'An Email has been sent to your email account with instructions on how to reset your password';
					});


				};

			//Set New Password Upon Reset
			$scope.setNewPW = function(){
			//console.log('Setting New Password');
			console.log($scope.newpw+' <--- New Password');
			console.log($scope.confirmpw+' <--- Confirm Password');

			if($scope.newpw===$scope.confirmpw){
				console.log("Passwords Match");
				//$scope.mylocation = $routeParams.userId;
			$scope.success = $scope.error = $scope.pwNotMatch = null;
			
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
				$scope.newpw=null;
				$scope.confirmpw=null;
				$scope.success = true;
				$scope.passwordDetails = null;
				//console.log('Done baby!!!');
				//$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		}else{
			console.log('Passwords DO NOT MATCH');
			//window.alert('Passwords do not match');
			$scope.pwNotMatch = true;
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