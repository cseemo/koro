'use strict';

// Devices controller
angular.module('devices').controller('DevicesController', ['$scope', '$stateParams', '$location', '$modal','Authentication', 'Devices',
	function($scope, $stateParams, $location, $modal, Authentication, Devices ) {
		$scope.authentication = Authentication;

			// If user is not signed in then redirect back home
		if (!$scope.authentication.user) {
			console.log('User Not Logged in');
          var test = $location.path();
          test = test.substring(0,14);
          // console.log('Test Path',test);

          if(test==='/svccntrsignup' || test==='/workorderauth'){
            console.log('Geting Something approved');
          
          }else{
          	console.log('Please sign in');
          	$location.path('/signin');
		}
		}

		// Create new Device
		$scope.create = function() {
			// Create new Device object
			var device = new Devices ({
				type: this.deviceType,
				notes: this.deviceNotes,
				serialNumber: this.deviceSN,
				status: 'Available',
				});
			
			console.log('Device: ', device);
			// Redirect after save
			device.$save(function(response) {
				console.log('Saved');
				
				 
				toastr.info('This device has been added to the inventory');
				

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Device
		$scope.remove = function( device ) {
			if ( device ) { device.$remove();

				for (var i in $scope.devices ) {
					if ($scope.devices [i] === device ) {
						$scope.devices.splice(i, 1);
					}
				}
			} else {
				$scope.device.$remove(function() {
					$location.path('devices');
				});
			}
		};

		// Update existing Device
		$scope.update = function() {
			var device = $scope.device ;

			device.$update(function() {
				$location.path('devices/' + device._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Devices
		$scope.find = function() {
			$scope.devices = Devices.query();
		};

		//Find Devices for this Shop
		$scope.findShop = function() {
			$scope.devices = Devices.query({shopId: $scope.authentication.user.shop});
		};

		// Find existing Device
		$scope.findOne = function() {
			$scope.device = Devices.get({ 
				deviceId: $stateParams.deviceId
			});
		};

		$scope.typeOfDevices = ['Brac Auditlock 1', 'Ali\'s Device', 'Other'];


		$scope.openModal = function(type){


		console.log('Opening Modal', type);
		var template = 'myModalContent.html';
		var size = 'lg';
		var controller = 'inventoryCtrl';

		if(type==='checkin'){
			template = 'modules/devices/views/create-device.client.view.html';
			size = 'sm';
		
		}
		if(type==='shopCheckInModal'){
			template = 'shopCheckInModal.html';
			size = 'lg';
			controller = 'shopInventoryCtrl';
		
		}

		

		  var modalInstance = $modal.open({
          templateUrl: template,
          controller: controller,
          size: size,
          resolve: {
            device: function() {
              return $scope.device;
            }

            },
            
           
		  });

		  };




}]).controller('shopInventoryCtrl', [
    '$scope', '$modalInstance', 'Authentication', '$http', 'Devices', 'Shops', 'device', '$location', '$filter',  function($scope, $modalInstance, Authentication, $http, Devices, Shops, device, $location, $filter) {
     $scope.authentication = Authentication;
     $scope.shops = Shops.query();
     $scope.headingtext = 'Inventory Management';
     $scope.devicesToShip = [];

     $scope.getDevices = function(){
     	// $scope.devices 
     		$scope.availableDevices = Devices.query({status: 'Pending', shopId: Authentication.user.shop});

     	$scope.availableDevices.$promise.then(function(){
     		console.log('Got Pending Devices for this Shop', $scope.availableDevices);

     		 // $scope.availableDevices = $filter('filter')($scope.devices, {status: 'Available'});
     		 // console.log('$scope.availableDevices', $scope.availableDevices);

     	})
     // 	var devices = $http({
					// method: 'get',
					// url: '/getAvailableDevices', 
					
					// 	})
					// .success(function(data, status) {
					// 	console.log('Available Devices: ', data);
					// 	$scope.availableDevices = data;
					// });


     };

     $scope.addDevice = function(row){
     	console.log('Adding device' );
     	$scope.availableDevices[row].status='Pending';
     	$scope.devicesToShip.push($scope.availableDevices[row]);
     	$scope.availableDevices.splice(row, 1);

     };

          $scope.remDevice = function(row){
     	console.log('Adding device' );
     	$scope.devicesToShip[row].status='Available';
     	$scope.availableDevices.push($scope.devicesToShip[row]);


     	$scope.devicesToShip.splice(row, 1);

     };

     $scope.changeSvcCenter = function(){
     	console.log('Changing Service Center ');

     };

     $scope.ok = function(){
     	
     	var devices = $scope.devicesToShip;
     	angular.forEach(devices, function(device){
			console.log('Device ID: ', device._id);

			device.status = 'Pending Deployment';
			device.details.push({
				type: 'Received by Shop',
				updated: Date.now(),
				destination: 'Shop Shelf',
				requestor: $scope.authentication.user.displayName
			});
			

			device.$update();
			
			console.log('Device: ', device);

						})
     	 $modalInstance.dismiss('submitted');
     	 var qtyDetails = devices.length+' device has';
     	 if(devices.length > 1) qtyDetails = devices.length+' devices have';
     	 
     	 toastr.success('Inventory has been updated. '+qtyDetails+' have been added to our inventory.' );

     	 };

       $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };


     
     
	

	}

]).controller('inventoryCtrl', [
    '$scope', '$modalInstance', 'Authentication', '$http', 'Devices', 'Shops', 'device', '$location', '$filter',  function($scope, $modalInstance, Authentication, $http, Devices, Shops, device, $location, $filter) {
     $scope.authentication = Authentication;
     $scope.shops = Shops.query();
     $scope.headingtext = 'Inventory Management';
     $scope.devicesToShip = [];

     $scope.getDevices = function(){
     	// $scope.devices 
     		$scope.availableDevices = Devices.query({status: 'Available'});

     	$scope.availableDevices.$promise.then(function(){
     		console.log('Got devices', $scope.devices);

     		 // $scope.availableDevices = $filter('filter')($scope.devices, {status: 'Available'});
     		 // console.log('$scope.availableDevices', $scope.availableDevices);

     	})
     // 	var devices = $http({
					// method: 'get',
					// url: '/getAvailableDevices', 
					
					// 	})
					// .success(function(data, status) {
					// 	console.log('Available Devices: ', data);
					// 	$scope.availableDevices = data;
					// });


     };

     $scope.addDevice = function(row){
     	console.log('Adding device' );
     	$scope.availableDevices[row].status='Pending';
     	$scope.devicesToShip.push($scope.availableDevices[row]);
     	$scope.availableDevices.splice(row, 1);

     };

          $scope.remDevice = function(row){
     	console.log('Adding device' );
     	$scope.devicesToShip[row].status='Available';
     	$scope.availableDevices.push($scope.devicesToShip[row]);


     	$scope.devicesToShip.splice(row, 1);

     };

     $scope.changeSvcCenter = function(){
     	console.log('Changing Service Center ');

     };

     $scope.ok = function(){
     	console.log('Shipping Devices to: ', $scope.serviceCenter);
     	console.log('Devices to Ship: ', $scope.devicesToShip);
     	var devices = $scope.devicesToShip;
     	angular.forEach(devices, function(device){
			console.log('Device ID: ', device._id);
			device.details.push({
				type: 'Ship to Shop',
				updated: Date.now(),
				destination: $scope.serviceCenter.name,
				requestor: $scope.authentication.user.displayName
			});
			device.shopId = $scope.serviceCenter._id;

			device.$update();
			
			console.log('Device: ', device);

						})
     	 $modalInstance.dismiss('submitted');
     	 var qtyDetails = devices.length+' device has';
     	 if(devices.length > 1) qtyDetails = devices.length+' devices have';
     	 
     	 toastr.success('Inventory has been updated. '+qtyDetails+' been scheduled to ship to '+$scope.serviceCenter.name+'...leaving '+$scope.availableDevices.length+' available in inventory.');

     };

       $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };


     
     
	

	}

]);