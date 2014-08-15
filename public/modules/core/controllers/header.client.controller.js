'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location', '$cookieStore',
	function($scope, Authentication, Menus, $location, $cookieStore) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		if( ! Authentication.user ) $location.path('/signin');
		// console.log('does the user have the user role?: ', Authentication.hasRole('user'));
		// console.log('does the user have the admin role?: ', Authentication.hasRole('admin'));
$scope.clockedIn = false;
$scope.clockedInVal = 'Clocked-Out';

$scope.clockIn= function(type) {
	$scope.clockedIn = true;
		$scope.clockedInVal = 'Clocked-In';
			switch(type){
				case 'break': 
			window.alert("You have been clocked-in for break at "+Date.now());
			$cookieStore.put('breakEnd', Date.now());
			break;

			case 'lunch': 
			window.alert("You have been clocked-in for lunch at "+Date.now());
			$cookieStore.put('lunchEnd', Date.now());
			break;

			case 'shift': 
			window.alert("You have been clocked-in at "+Date.now());
			$cookieStore.put('shiftStart', Date.now());
			break;
			}
			

		};


		$scope.clockOut = function(type) {
			$scope.clockedIn = false;
			$scope.clockedInVal = 'Clocked-Out';
			switch(type){
				case 'break': 
			window.alert("You have been clocked-out for break at "+Date.now());
			$cookieStore.put('breakStart', Date.now());
				$scope.clockedInVal = 'At Break';
			break;

			case 'lunch': 
			window.alert("You have been clocked-out for lunch at "+Date.now());
			$cookieStore.put('lunchStart', Date.now());
				$scope.clockedInVal = 'At Lunch';
			break;

			case 'shift': 
			window.alert("You have been clocked-out at "+Date.now());
			$cookieStore.put('shiftEnd', Date.now());
			break;
			}
			

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