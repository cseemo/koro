'use strict';

angular.module('core').controller('NavController', ['$scope', 'Authentication', 'Menus', '$location', '$http',
	function($scope, Authentication, Menus, $location, $http) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.isAdmin = false;



		//console.log('Menu items: ', $scope.menu);
		$scope.getLead = function() {
			//window.alert('gettinglead');
						$http({
		method: 'get',
		url: '/getnewlead',
	})
.success(function(data, status) {
		if(status === 200) {
			//$scope.currentPrice = data.price;
console.log('Data: ',data);
console.log('Data.Response: %o',data._id);
	
	$location.path('leads/' + data._id);
		}
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