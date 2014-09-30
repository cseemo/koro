'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location', '$cookieStore', '$http',
	function( $scope, Authentication, Menus, $location, $cookieStore, $http) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');



		$scope.numNotifications = $scope.authentication.user.notifications.length;
		//if( ! Authentication.user ) $location.path('/signin');
		if( Authentication.user ) {
			console.log('Logged In ');
			$scope.canSee=true;
		}

		if( ! Authentication.user ) {
			console.log('not logged in');
			$scope.canSee=false;

		}
		// console.log('does the user have the user role?: ', Authentication.hasRole('user'));
		// console.log('does the user have the admin role?: ', Authentication.hasRole('admin'));
$scope.clockedIn = false;
$scope.clockedInVal = 'Clocked-Out';

$scope.clockIn= function(type) {
	console.log('Got Here');
	$scope.clockedIn = true;

	//console.log('timecard %o',$scope);
		$scope.clockedInVal = 'Clocked-In';
			switch(type){
				case 'break': 
			toastr.info('You have been clocked-in for break at '+Date.now());
			$cookieStore.put('breakEnd', Date.now());
			
			break;

			case 'lunch': 
			toastr.info('You have been clocked-in for lunch at '+Date.now());
			$cookieStore.put('lunchEnd', Date.now());
			break;

			case 'shift': 
			toastr.info('You have been clocked-in at '+Date.now());
			$cookieStore.put('shiftStart', Date.now());
			break;
			}
			
	$http.get('/awesome/clock').success(function(data) {
	
	console.log('Response %o',data);
	//window.alert('Response');
}).error(function(data) {

console.log('Error: ' + data);
});

		};


		$scope.clockOut = function(type) {
			$scope.clockedIn = false;
			$scope.clockedInVal = 'Clocked-Out';
			switch(type){
				case 'break': 
			toastr.info('You have been clocked-out for break at '+Date.now());
			$cookieStore.put('breakStart', Date.now());
				$scope.clockedInVal = 'At Break';
			break;

			case 'lunch': 
			toastr.info('You have been clocked-out for lunch at '+Date.now());
			$cookieStore.put('lunchStart', Date.now());
				$scope.clockedInVal = 'At Lunch';
			break;

			case 'shift': 
			toastr.info('You have been clocked-out at '+Date.now());
			$cookieStore.put('shiftEnd', Date.now());
			break;
			}

				$http.get('/awesome/clock').success(function(data) {
	
	console.log('Response %o',data);
	//window.alert('Response');
}).error(function(data) {

console.log('Error: ' + data);
});
			

		};
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);