'use strict';

// Devices controller
angular.module('devices').controller('DevicesController', ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Devices', '$filter', 'Shops', 'Offenders', 
	function($scope, $stateParams, $location, $modal, Authentication, Devices, $filter, Shops, Offenders) {
		$scope.authentication = Authentication;

			// If user is not signed in then redirect back home
		// if (!$scope.authentication.user) {
		// 	console.log('User Not Logged in');
  //         var test = $location.path();
  //         test = test.substring(0,14);
  //         // console.log('Test Path',test);

  //         if(test==='/svccntrsignup' || test==='/workorderauth' || test==='/newshopsignup'){
  //           console.log('Geting Something approved');
          
  //         }else{
  //         	console.log('Please sign in');
  //         	$location.path('/signin');
		// }
		// }

		// Create new Device
		$scope.create = function() {
			console.log('Making new device');
			// Create new Device object
			$modal.close();

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
			console.log('Updateing');
			var device = $scope.device ;

			device.$update(function() {
				$location.path('devices/' + device._id);
				toastr.success('Device notes have been saved...');
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
				if(type==='sendToBudget'){
			template = 'shipToBudgetModal.html';
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


		  //Table Stuff

  $scope.tableData = {
      searchKeywords: '',
    };
    $scope.filteredDevices= [];
    $scope.row = '';
    $scope.numPerPageOpt = [3, 5, 10, 20];
    $scope.numPerPage = $scope.numPerPageOpt[2];
    $scope.currentPage = 1;
    //$scope.currentPageDeals= $scope.getinit;
    $scope.currentPageDevices= [];



    $scope.select = function(page) {
    	 
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
      // console.log('Start '+start+' and End '+end);
     
      // console.log('Filtered Offenders', $scope.filteredOffenders);
      $scope.currentPage = page;
      $scope.currentPageDevices = $scope.filteredDevices.slice(start, end);
      // console.log('Current Page Offenders', $scope.currentPageOffenders);
     // angular.forEach($scope.currentPageOffenders, function(item){
	// 	console.log('Offender: ', item);
	// 	// item.shopName = 'Test';
	// 	if(item.assignedShop){
	// 		console.log('Shop has an assigned SHop');
	// 		var myShop = Shops.get({ 
	// 			shopId: item.assignedShop
	// 				});
	// 	      	myShop.$promise.then(function(){
	// 	      		console.log('Shop Promise finished', myShop);
		      		
	// 		      	item.shopName = myShop.name;
		      		

	// 	      	});

		
      		

	// 	}
	// })
		
		return $scope.currentPageDevices;


    };

    $scope.onFilterChange = function() {
      $scope.select(1);
      $scope.currentPage = 1;
      return $scope.row = '';
    };
    $scope.onNumPerPageChange = function() {
      $scope.select(1);
      return $scope.currentPage = 1;
    };
    $scope.onOrderChange = function() {
      $scope.select(1);
      return $scope.currentPage = 1;
    };
    $scope.search = function() {
      // console.log('Keywords: ', $scope.tableData.searchKeywords);
      // console.log('Offenders; ', $scope.offenders);
      $scope.filteredDevices = $filter('filter')($scope.devices, $scope.tableData.searchKeywords);

      return $scope.onFilterChange();
    };

     $scope.searchPending = function() {
      //////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredDevices = $filter('filter')($scope.devices, $scope.tableData.searchKeywords);

      // {companyname: $scope.tableData.searchKeywords},

      /*$scope.filteredRegistrations = $filter('filter')($scope.registrations, {
        firstName: $scope.searchKeywords,
        lastName: $scope.searchKeywords,
        confirmationNumber: $scope.searchKeywords,
      });*/
      return $scope.onFilterChange();
    };


    $scope.order = function(rowName) {
    	console.log('Reordering by ',rowName);
    	//////////////console.log('Scope.row ', $scope.row);
      if ($scope.row === rowName) {
        return;
      }
      $scope.row = rowName;
      $scope.filteredDevices = $filter('orderBy')($scope.filteredDevices, rowName);
      //////////////console.log(rowName);
      return $scope.onOrderChange();
    };
    $scope.setCurrentOffender = function(ind) {
      $scope.currentDevice = $scope.filteredDevices.indexOf(ind);
    };

    $scope.init = function() {
    	console.log('Getting Devics');
    	$scope.devices = Devices.query();
    	$scope.devices.$promise.then(function() {
				// $scope.search();
				$scope.filteredDevices = $scope.devices;

				     angular.forEach($scope.filteredDevices, function(item){
		console.log('Device: ', item);
		// item.shopName = 'Test';

		//Get Offender Using Device
				if(item.offender){
			console.log('Device has an assigned Client');
			var myClient = Offenders.get({ 
				offenderId: item.offender
			});
		      	myClient.$promise.then(function(){
		      		console.log('Client Promise finished', myClient);
		      		
			      	item.clientName = myClient.displayName;
		      		

		      	});

		
      		

		}
		//Get the SHop that the Device is Assigned To
		if(item.shopId){
			console.log('Device has an assigned SHop');
			var myShop = Shops.get({ 
				shopId: item.shopId
					});
		      	myShop.$promise.then(function(){
		      		console.log('Shop Promise finished', myShop);
		      		
			      	item.shopName = myShop.name;
		      		

		      	});

		
      		

		}
	})


				return $scope.select($scope.currentPage);
				});	
	

    };





}]).controller('shopInventoryCtrl', [
    '$scope', '$modalInstance', 'Authentication', '$http', 'Devices', 'Shops', 'device', '$location', '$filter',  function($scope, $modalInstance, Authentication, $http, Devices, Shops, device, $location, $filter) {
     $scope.authentication = Authentication;
     $scope.shops = Shops.query();
     $scope.headingtext = 'Inventory Management';
     $scope.devicesToShip = [];

         $scope.getAllDevices = function(){
     	// $scope.devices 
     		$scope.availableDevices = Devices.query({shopId: Authentication.user.shop});

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
			device.shop = $scope.authentication.user.shop;
			device.status = 'En Route to Budget';
			device.details.push({
				type: 'Ship to Budget',
				updated: Date.now(),
				destination: 'Budget Corporate',
				requestor: $scope.authentication.user.displayName
			});
			

			device.$update();
			
			console.log('Device: ', device);

						})
     	 $modalInstance.close('submitted');
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

		$scope.typeOfDevices = ['Brac Auditlock 1', 'Ali\'s Device', 'Other'];


     	$scope.create = function() {
			console.log('Making new device INVENTORY CONTROL');
			// Create new Device object
			var details = [];
			details.push({
					type: 'Check In',
					updated: Date.now(),
					destination: 'New Inventory',
					requestor:$scope.authentication.user.displayName,
					notes: this.deviceNotes,
	
				});
			var device = new Devices ({
				type: this.deviceType,
				notes: this.deviceNotes,
				serialNumber: this.deviceSN,
				status: 'Available',
				details: details
				// details: {[
				// type: 'Check-In', 
				// updated: Date.now()
				// ]}
				});

			
			
			console.log('Device: ', device);
			// Redirect after save
			device.$save(function(response) {
				console.log('Saved');
				
				 $modalInstance.close();
				toastr.info('This device has been added to the inventory');

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

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
			console.log('Device Details: ', device.details);
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