'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location',
	function($scope, Authentication, Menus, $location) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		if( ! Authentication.user ) $location.path('/signin');
		// console.log('does the user have the user role?: ', Authentication.hasRole('user'));
		// console.log('does the user have the admin role?: ', Authentication.hasRole('admin'));

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);