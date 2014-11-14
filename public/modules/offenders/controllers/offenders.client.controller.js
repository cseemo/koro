'use strict';


// Offenders controller
angular.module('offenders').controller('OffendersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offenders', '$filter', '$modal', '$log', '$http', 
	function($scope, $stateParams, $location, Authentication, Offenders, $filter, $modal, $log, $http) {
		$scope.authentication = Authentication;
		$scope.pendingOrder = true;
		// Create new Offender
	


		$scope.create = function() {
			// Create new Offender object

		var mainPhone = $filter('tel')(this.mainPhone);
		var altPhone = $filter('tel')(this.altPhone);
		

		
			var offender = new Offenders ({
				firstName: this.firstName,
				lastName: this.lastName,
				mainPhone: mainPhone, 
				altPhone: altPhone, 
				offenderEmail: this.offenderEmail, 
				billingAddress: this.billingAddress, 
				billingCity: this.billingCity, 
				billingState: this.billingState, 
				billingZipcode: $scope.billingZipcode, 
				stateReportTo: $scope.stateReportTo, 
				vehicleMake: $scope.vehicleMake, 
				vehicleYear: $scope.vehicleYear,
				vehicleModel: $scope.vehicleModel,
				driverNumber: $scope.driverNumber
			});

			// Redirect after save
			offender.$save(function(response) {
				$location.path('offenders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


	$scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
   $scope.state = $scope.states[2];
   $scope.stateReportTo = $scope.states[4];

   $scope.vehicles = [
		'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge',
		'FIAT', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
		'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'MINI', 'Mitsubishi',
		'Nissan', 'Scion', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen',
		'Volvo', 'Porsche', 'Other',
	];
	$scope.vehicleMake = $scope.vehicles[29];
	$scope.deviceIssues = ['None', 'Loose Cord', 'Won\'t Charge', 'Keeps Saying He\'s Drunk'];
	$scope.deviceIssue = $scope.deviceIssues[0];

		$scope.vehicleYears = function() {
				var y = [];
				for(var i = new Date().getFullYear() + 1; i >= 1900; i--) {
					y.push(i);
				}
				return y;
			}();

					$scope.expYears = function() {
				var y = [];
				for(var i = new Date().getFullYear(); i <= new Date().getFullYear() + 7 ; i++) {
					y.push(i);
				}
				return y;
			}();
			$scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov','Dec'];
			$scope.expMonth = $scope.months[1];
			$scope.expYear = $scope.expYears[2];
			
		
		$scope.vehicleYear = $scope.vehicleYears[1];


		$scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };


//Modal Stuff for New Work Order
      $scope.workOrderTypes = ['New Install', 'Calibration', 'Reset', 'Removal'];
      $scope.open = function() {
        var modalInstance;
        var offender = $scope.offender;
        modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function() {
              return $scope.workOrderTypes;
            }, 
            offender: function() {
              return $scope.offender;
            }
          }
        });
        modalInstance.result.then(function(selectedItem, offender) {
          $scope.selected = selectedItem;
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };


      //Table for Work Orders per Offender
      $scope.getWorkOrders = function(){
      	console.log('Getting Work Orders');
					$http({
		method: 'get',
		url: '/orderByOffender/'+$scope.offender._id,
			})
		.success(function(data, status) {
				if(status === 200) {
					//$scope.currentPrice = data.price;
		//console.log('Data: ',data);
		//console.log('Data.Response: %o',data._id);
			
			console.log('Return Data: ', data);
				}
			});


};


		// Remove existing Offender
		$scope.remove = function( offender ) {
			if ( offender ) { offender.$remove();

				for (var i in $scope.offenders ) {
					if ($scope.offenders [i] === offender ) {
						$scope.offenders.splice(i, 1);
					}
				}
			} else {
				$scope.offender.$remove(function() {
					$location.path('offenders');
				});
			}
		};

		// Update existing Offender
		$scope.update = function() {
			var offender = $scope.offender ;

			offender.$update(function() {
				$location.path('offenders/' + offender._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Offenders
		$scope.find = function() {
			$scope.offenders = Offenders.query();
		};

		// Find existing Offender
		$scope.findOne = function() {
			$scope.offender = Offenders.get({ 
				offenderId: $stateParams.offenderId
			});
		};
	}


  ]).controller('ModalInstanceCtrl', [
    '$scope', '$modalInstance', 'items', 'offender', 'Authentication', '$http', 'Workorders',  function($scope, $modalInstance, items, offender, Authentication, $http, Workorders) {
     $scope.authentication = Authentication;
      $scope.items = items;
      $scope.selected = {
        item: $scope.items[0]
      };
      $scope.whomCus = true;
      $scope.chosen = items[0];
      $scope.subjectText = ' Authorization from Carefree Interlock';
      $scope.sendToOptions = ['Customer', 'Service Center', 'Court', 'Attorney'];
      $scope.sendTo = $scope.sendToOptions[0];
      console.log('Our Offender Is: ', offender);
      $scope.emailSubject = $scope.chosen+$scope.subjectText;
      $scope.offender = offender;
      $scope.emailAddress = offender.offenderEmail;
      $scope.toWhomName = $scope.offender.firstName+' '+$scope.offender.lastName;

      $scope.changeWho = function(){
      	console.log('Changing who', $scope.sendTo);
      	if($scope.sendTo==='Customer'){
      			$scope.emailAddress = offender.offenderEmail;
      			$scope.subjectText = ' Authorization from Carefree Interlock';
      			$scope.emailSubject = $scope.chosen+$scope.subjectText;
      			$scope.toWhomName = $scope.offender.displayName;
      			$scope.whomCus = true;
      	}else{
      		$scope.emailAddress = null;
      		$scope.subjectText = ' Work Authorization for '+offender.firstName+' '+offender.lastName+' from Carefree Interlock ';
      		$scope.emailSubject = $scope.chosen+$scope.subjectText;
      		$scope.toWhomName = $scope.toWhoName;
      		$scope.whomCus = false;
      	}
      


      };

            $scope.changeType = function(){
      	console.log('Changing Type', $scope.chosen);

      	$scope.emailSubject = $scope.chosen+' Authorization from Carefree Interlock';


      };


  

      $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
        $scope.workOrder = {
        	email: $scope.emailAddress,
        	type: $scope.chosen,
        	subject: $scope.emailSubject,
        	content: $scope.emailText,
        	toWhom: $scope.sendTo,
        	serviceCenter: $scope.serviceCenter,
        	toWhomName: $scope.toWhomName

        };
        console.log($scope);

        	//Save New Work Order
        		var workorder = new Workorders ({
				serviceCenter: $scope.serviceCenter,
				offender: $scope.offender._id,
				type: $scope.chosen
				
			});

        		console.log('Work Order: ', workorder);
			// Redirect after save
			workorder.$save(function(response) {
					$scope.workOrder._id = response._id;

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			console.log('Work order status...', $scope.workOrder);

        $http({
					method: 'post',
					responseType: 'arraybuffer',
					url: '/work/order', 
					data: {
						'user': $scope.authentication.user,
						'offender': $scope.offender,
						'workinfo': $scope.workOrder
						
					},
					
			})
		.success(function(data, status) {
		
		$scope.sending = false;
		$scope.results = true;
		//////console.log('Data from LOA?? %o',data);
		toastr.success('Success! Email was sent...');
			$scope.myresults = 'Email Sent!';
			
			

			var file = new Blob([data], {type: 'application/pdf'});
     		var fileURL = URL.createObjectURL(file);
     		window.open(fileURL);
     		
     		


					});

      };


      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('PaginationDemoCtrl', [
]).controller('AccordionDemoCtrl', function ($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: 'Dynamic Group Header - 1',
      content: 'Dynamic Group Body - 1'
    },
    {
      title: 'Dynamic Group Header - 2',
      content: 'Dynamic Group Body - 2'
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
});;





	// $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
 //   $scope.state = $scope.states[2];
 //   $scope.stateReportTo = $scope.states[4];

 //   $scope.vehicles = [
	// 	'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge',
	// 	'FIAT', 'Ford', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
	// 	'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'MINI', 'Mitsubishi',
	// 	'Nissan', 'Scion', 'Smart', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen',
	// 	'Volvo', 'Porsche', 'Other',
	// ];
	// $scope.vehicleMake = $scope.vehicles[8];

	// 	$scope.vehicleYears = function() {
	// 			var y = [];
	// 			for(var i = new Date().getFullYear() + 1; i >= 1900; i--) {
	// 				y.push(i);
	// 			}
	// 			return y;
	// 		}();

	// 				$scope.expYears = function() {
	// 			var y = [];
	// 			for(var i = new Date().getFullYear(); i <= new Date().getFullYear() + 7 ; i++) {
	// 				y.push(i);
	// 			}
	// 			return y;
	// 		}();
	// 		$scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov','Dec'];
	// 		$scope.expMonth = $scope.months[1];
	// 		$scope.expYear = $scope.expYears[2];
			
		
	// 	$scope.vehicleYear = $scope.vehicleYears[1];



	// 	// Create new Offender
	// 	$scope.create = function() {
	// 		console.log('Adding a new offender');
	// 		// console.log($scope.firstName);
	// 		// console.log($scope.lastName);
	// 		// console.log($scope.mainPhone);
	// 		// console.log($scope.driverNumber);
	// 		// console.log($scope.altPhone);
	// 		// Create new Offender object
	// 		console.log('First Name', this.firstName);
	// 		// var offender = new Offenders ({
	// 		// 	firstName: this.firstName
	// 			// lastName: $scope.lastName, 
	// 			// mainPhone: $scope.mainPhone, 
	// 			// altPhone: $scope.altPhone, 
	// 			// offenderEmail: $scope.offenderEmail, 
	// 			// billingAddress: $scope.billingAddress, 
	// 			// billingCity: $scope.billingCity, 
	// 			// billingState: $scope.billingState, 
	// 			// billingZipcode: $scope.billingZipcode, 
	// 			// stateReportTo: $scope.stateReportTo, 
	// 			// vehicleMake: $scope.vehicleMake, 
	// 			// vehicleYear: $scope.vehicleYear,
	// 			// driverNumber: $scope.driverNumber

	// 		// });

	// 		var offender = new Offenders ({
	// 			name: 'Ted', 
	// 			firstName: 'Steve'
	// 		});

	// 		console.log('Offender Info: ', offender);
	// 		// Redirect after save
	// 		offender.$save(function(response) {
	// 			console.log('Response: ', response);
	// 			$location.path('offenders/' + response._id);

	// 			// Clear form fields
	// 			$scope.name = '';
	// 		}, function(errorResponse) {
	// 			$scope.error = errorResponse.data.message;
	// 		});
	// 	};