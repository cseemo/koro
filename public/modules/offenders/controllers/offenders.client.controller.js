'use strict';


// Offenders controller
angular.module('offenders').controller('OffendersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Offenders', 'Workorders', '$filter', '$modal', '$log', '$http', 
	function($scope, $stateParams, $location, Authentication, Offenders, Workorders, $filter, $modal, $log, $http) {
		$scope.authentication = Authentication;
		$scope.pendingOrder = true;
		// Create new Offender
		
		$scope.signedUpStatus = 'Get Install Agreement Signed';
		
		$scope.checklist = [
		{item: 'Set Appointment Date', click: 'setAppt'},
		{item: 'Customer Check-In', click: 'checkIn'},
		{item: 'Inspect Vehicle', click: 'inspected'},
		// {item: 'Verify Horn Works', click: 'false'},
		{item: 'Have Customer Watch Training Video', click: 'customerVideo'},
		{item: $scope.signedUpStatus, click: 'installPaperwork'},
		{item: 'Check-Out Device', click: 'checkOutDevice'},
		// {item: 'Complete Device Installation', click: 'checkItem($index)'},
		// {item: 'Verify Horn and Lights Work', click: 'checkItem($index)'},
		{item: 'Installation Complete', click: 'complete'}
		];


		$scope.saveMe = function() {
			console.log('Save it!!');
			$scope.offender.$update().then(function(){
				console.log('Saved');
			});


		};
		


		$scope.clicked = function(data, index) {
			console.log('Clicked; ', data);
			console.log('Workorder: ', $scope.workorder);
			if(data==='checkIn') $scope.checkInCustomer(index);
			if(data==='setAppt') $scope.setApptModal();
			if(data==='complete') $scope.completeOrder();
			if(data==='checkOutDevice') $scope.checkOutDevice();
			if(data==='inspected') $scope.inspection();
			if(data==='customerVideo') $scope.customerVideo();
			if(data==='installPaperwork') $scope.getAuth();
			// console.log('Offender: ', $scope.offender);
		};


		$scope.customerVideo = function() {
			$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
				// console.log('Wo is: ', wo);
				$scope.workorder.$promise.then(function() {
					var wo = $scope.workorder;
					console.log('Got the work order promise complete', $scope.workorder);
					wo.customerVideo = Date.now();
					wo.status = 'Customer Training Video';

				
					wo.$update(function(){
					console.log('Update complete!', wo);

				});
				});


		};

		$scope.inspection = function() {
			$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
				// console.log('Wo is: ', wo);
				$scope.workorder.$promise.then(function() {
					var wo = $scope.workorder;
					console.log('Got the work order promise complete', $scope.workorder);
					wo.inspected = Date.now();
					wo.status = 'Inspection Complete';

				
					wo.$update(function(){
					console.log('Update complete!', wo);

				});
				});


		};

		

		$scope.getAuth = function() {
			console.log('Authorizing WOrk', $scope.workorder._id);
			var modalInstance;
	        var offender = $scope.offender;
	        modalInstance = $modal.open({
	          templateUrl: 'agreement.html',
	          controller: 'ModalInstanceCtrl',
	          resolve: {
	            items: function() {
	              return $scope.workOrderTypes;
	            }, 
	             workorder: function() {
	              return $scope.workorder._id;
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



		$scope.checkOutDevice = function() {
			console.log('Checking Out Device', $scope.workorder._id);
			var modalInstance;
	        var offender = $scope.offender;
	        modalInstance = $modal.open({
	          templateUrl: 'checkOutDevice.html',
	          controller: 'ModalInstanceCtrl',
	          resolve: {
	            items: function() {
	              return $scope.workOrderTypes;
	            }, 
	             workorder: function() {
	              return $scope.workorder._id;
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




		$scope.completeOrder = function() {
			console.log('WE are completing the work order!');
			var modalInstance;
	        var offender = $scope.offender;
	        modalInstance = $modal.open({
	          templateUrl: 'completeOrder.html',
	          controller: 'ModalInstanceCtrl',
	          resolve: {
	            items: function() {
	              return $scope.workOrderTypes;
	            }, 
	             workorder: function() {
	              return $scope.workorder._id;
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


			// console.log($scope.workorder);
			// $scope.workorder = $scope.findWorkOrder($scope.workorder._id);
			// 	// console.log('Wo is: ', wo);
			// 	$scope.workorder.$promise.then(function() {
			// 		var wo = $scope.workorder;
			// 		console.log('Got the work order promise complete', $scope.workorder);
			// 		wo.completed = Date.now();
			// 		wo.status = 'Complete';

				
			// 		wo.$update(function(){
			// 		console.log('Update complete!', wo);

			// 	});
			// 	});



		};


		$scope.checkItem = function(row) {
			window.alert('Row is: '+ row);
			console.log('Checking ', this);

			

		};
		$scope.checkInCustomer = function(row) {
			toastr.info('Customer has arrived: '+ Date.now());
			console.log('Checking ', this);

				$scope.workorder = $scope.findWorkOrder($scope.workorder._id);
				// console.log('Wo is: ', wo);
				$scope.workorder.$promise.then(function() {
					var wo = $scope.workorder;
					console.log('Got the work order promise complete', $scope.workorder);
					wo.checkIn = Date.now();
					wo.status = 'In Process';

				
					wo.$update(function(){
					console.log('Update complete!', wo);

				});
				});
			

		};


   $scope.setApptModal = function() {
      	console.log('Opening Modal');
        var modalInstance;
        var offender = $scope.offender;
        modalInstance = $modal.open({
          templateUrl: 'setApptModal.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function() {
              return $scope.workOrderTypes;
            }, 
             workorder: function() {
              return $scope.workorder._id;
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

      $scope.updateCCInfo = function() {
      	console.log('Updating Credit Card Info');

      	$scope.offender.$promise.then(function() {

      		console.log('Credit Card:', $scope.offender);
	      	$scope.offender.cardExp =  $scope.expYear+'-'+$scope.expMonth;
	      	// $scope.offender.cardExp = $scope.cardExp;
			$scope.offender.cardCVV = $scope.cardCVV;
			$scope.offender.cardNumber = $scope.cardNumber;
			// console.log
			console.log('OFfender Updating: ', $scope.offender);
	      	$scope.offender.$update(function() {
	      		console.log('Offender info to send: ', $scope.offender);
     			$http({
					method: 'get',
					url: '/updateCCInfo/'+$scope.offender._id,
					})
					.success(function(data, status) {
							if(status === 200) {
								
							console.log('Return Data: ', data);
							toastr.success(data);

							console.log('Card info?? ', $scope.offender);
							$scope.cardExp = '';
							$scope.cardCVV = '';
							$scope.cardNumber = '';




							}
				}).error(function(err, data){
					toastr.error(err);
					console.log('Data from Error Validating or Updating Creidt Card');


				});
});
     	});

      };



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
				driverNumber: $scope.driverNumber, 
				cardNumber: $scope.offenderCC,
				cardCVV: $scope.creditCardCCV,
				cardExp: $scope.expYear+'-'+$scope.expMonth,
				dobMO: $scope.dobMO,
				dobDAY: $scope.dobDAY,
				dobYR: $scope.dobYR,
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


		//Offender List Table Stuff

  $scope.tableData = {
      searchKeywords: '',
    };
    $scope.filteredOffenders= [];
    $scope.row = '';
    $scope.numPerPageOpt = [3, 5, 10, 20];
    $scope.numPerPage = $scope.numPerPageOpt[2];
    $scope.currentPage = 1;
    //$scope.currentPageDeals= $scope.getinit;
    $scope.currentpageOffenders= [];



    $scope.select = function(page) {
    	 
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
      //////////////console.log('Start '+start+' and End '+end);
      $scope.currentPage = page;
     
      return $scope.currentPageOffenders = $scope.filteredOffenders.slice(start, end);


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
      //////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredOffenders = $filter('filter')($scope.offenders, $scope.tableData.searchKeywords);

      return $scope.onFilterChange();
    };

     $scope.searchPending = function() {
      //////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredOffenders = $filter('filter')($scope.offenders, $scope.tableData.searchKeywords);

      // {companyname: $scope.tableData.searchKeywords},

      /*$scope.filteredRegistrations = $filter('filter')($scope.registrations, {
        firstName: $scope.searchKeywords,
        lastName: $scope.searchKeywords,
        confirmationNumber: $scope.searchKeywords,
      });*/
      return $scope.onFilterChange();
    };


    $scope.order = function(rowName) {
    	//////////////console.log('Reordering by ',rowName);
    	//////////////console.log('Scope.row ', $scope.row);
      if ($scope.row === rowName) {
        return;
      }
      $scope.row = rowName;
      $scope.filteredOffenders = $filter('orderBy')($scope.filteredOffenders, rowName);
      //////////////console.log(rowName);
      return $scope.onOrderChange();
    };
    $scope.setCurrentOffender = function(ind) {
      $scope.currentOffender = $scope.filteredOffenders.indexOf(ind);
    };

    $scope.init = function() {
    	console.log('Getting Offenders');
    	$scope.offenders = Offenders.query();
    	$scope.offenders.$promise.then(function() {
				// $scope.search();
				$scope.filteredOffenders = $scope.offenders;
				return $scope.select($scope.currentPage);
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
			// $scope.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov','Dec'];
			$scope.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
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
      	console.log('Opening Modal');
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
            },
            workorder: function() {
              return $scope.workorder;
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
     	console.log($scope.offender);
     	$scope.offender.$promise.then(function() {
     			$http({
					method: 'get',
					url: '/orderByOffender/'+$scope.offender._id,
					})
					.success(function(data, status) {
							if(status === 200) {
								
							console.log('Return Data: ', data);
							$scope.workorders = data;
							}
				});

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

		var getInfo = function(id) {
			console.log('ID is: ', id);
			 $scope.pendingWorkType = 'Install';
		};
		

		$scope.findPending = function() {
			$http({
		method: 'get',
		url: '/getPendingOrders',
			})
		.success(function(data, status) {
			
				console.log('Return Data: ', data);
				$scope.offenders = data;
				$scope.filteredOffenders = data;
				$scope.select($scope.currentPage);

				
			});



		};

		$scope.findWorkOrder = function(id) {
     		console.log('Workorder: ', id);
			$scope.workorder = Workorders.get({ 
				workorderId: id
			});
			console.log('Found our Workorder:  ', $scope.workorder);
			return $scope.workorder;

		};

		// Find existing Offender
		$scope.findOne = function() {
			$scope.offender = Offenders.get({ 
				offenderId: $stateParams.offenderId
			});
		};

		$scope.findOne2 = function() {
			$scope.offender = Offenders.get({ 
				offenderId: $stateParams.offenderId
			});

			$scope.offender.$promise.then(function(){
				$http({
				method: 'get',
				url: '/workorders/'+$scope.offender.pendingWorkOrder,
					})
				.success(function(data, status) {
						if(status === 200) {
							//$scope.currentPrice = data.price;
				//console.log('Data: ',data);
				//console.log('Data.Response: %o',data._id);
			
				console.log('Return Data: ', data);
				$scope.workorder = data;
				console.log($scope.workorder);
				// $scope.workorder.checkIn = Date.now();
				if($scope.workorder.apptDate){
					console.log('This baby has an Appointment Date already!!');
					console.log("STuff: ", $scope.checklist[0]);
					$scope.checklist[0]['strike'] = "done-true" ;


				}
				if($scope.workorder.checkIn){
					console.log('This baby has been checked in already!!');
					console.log("STuff: ", $scope.checklist[1]);
					$scope.checklist[1]['strike'] = "done-true" ;
				}

				if($scope.workorder.inspected){
					console.log('This baby has been inspected already!!');
					console.log("STuff: ", $scope.checklist[2]);
					$scope.checklist[2]['strike'] = "done-true" ;
				}

				if($scope.workorder.customerVideo){
					console.log('Customer Video Already Watched!!');
					console.log("STuff: ", $scope.checklist[3]);
					$scope.checklist[3]['strike'] = "done-true" ;
				}
				if($scope.workorder.authSigned){

					console.log('Install Agreement Already Signed');
					console.log("STuff: ", $scope.checklist[4]);
					$scope.checklist[4]['strike'] = "done-true" ;
				}

				if($scope.workorder.deviceSN){
					console.log('Workorder Alrady has Serial Number Assigned');
					console.log("STuff: ", $scope.checklist[5]);
					$scope.checklist[5]['strike'] = "done-true" ;
				}
				if($scope.workorder.completed){
					console.log('Workorder Alrady Completed');
					console.log("STuff: ", $scope.checklist[6]);
					$scope.checklist[6]['strike'] = "done-true" ;
				}

				

				}
			});


			});
		};
			
	}




  ]).controller('ModalInstanceCtrl', [
    '$scope', '$modalInstance', 'items', 'offender', 'Authentication', '$http', 'Workorders', 'Shops', 'workorder', '$location',  function($scope, $modalInstance, items, offender, Authentication, $http, Workorders, Shops, workorder, $location) {
     $scope.authentication = Authentication;
     $scope.shops = Shops.query();
     $scope.findWorkOrder = function(id) {
     		console.log('Workorder: ', workorder);
     		if(id) workorder = id;
			$scope.workorder = Workorders.get({ 
				workorderId: workorder
			});
			console.log('Found our Workorder:  ', $scope.workorder);

			// 	$scope.workorder.$promise.then(function(){

			// 		console.log('Going after our OFfender');
			// 		console.log('Found our Workorder Offender:  ', $scope.workorder.offender);


			// 		var offender = Offenders.get({ 
			// 	offenderId: $scope.workorder.offender
			// });
		};
      $scope.items = items;
      $scope.selected = {
        item: $scope.items[0]
      };
      $scope.whomCus = true;
      $scope.chosen = items[0];
      $scope.subjectText = ' Authorization from Budget Ignition Interlock';
      $scope.sendToOptions = ['Customer', 'Service Center', 'Court', 'Attorney', 'Other'];
      $scope.sendTo = $scope.sendToOptions[0];
      // console.log('Our Offender Is: ', offender);
      $scope.emailSubject = $scope.chosen+$scope.subjectText;
      $scope.offender = offender;
      $scope.emailAddress = offender.offenderEmail;
      $scope.toWhomName = $scope.offender.firstName+' '+$scope.offender.lastName;

      $scope.changeSvcCenter = function(){
      	console.log('Name is: ', this);
      	// $scope.serviceCenter = name;
      	// console.log('Service Center: ', $scope.shops[name]['name']);
      	// console.log('Service Center: ', $scope.serviceCenter);


      };

      $scope.changeWho = function(){
      	console.log('Changing who', $scope.sendTo);
      	if($scope.sendTo==='Customer'){
      			$scope.emailAddress = offender.offenderEmail;
      			$scope.subjectText = ' Authorization from Budget Ignition Interlock';
      			$scope.emailSubject = $scope.chosen+$scope.subjectText;
      			$scope.toWhomName = $scope.offender.displayName;
      			$scope.whomCus = true;
      	}else{
      		$scope.emailAddress = null;
      		$scope.subjectText = ' Work Authorization for '+offender.firstName+' '+offender.lastName+' from Budget Ignition Interlock ';
      		$scope.emailSubject = $scope.chosen+$scope.subjectText;
      		$scope.toWhomName = $scope.toWhoName;
      		$scope.whomCus = false;
      	}
      


      };

            $scope.changeType = function(){
      	console.log('Changing Type', $scope.chosen);

      	$scope.emailSubject = $scope.chosen+' Authorization from Budget Ignition Interlock';


      };


  		$scope.schedule = function() {
  			console.log('Scheduling Appointment');
  			$modalInstance.close();
  			console.log('Scope.workorder', $scope.workorder);
  			console.log($scope.dt);
  			var wo = $scope.workorder;
  			var date = $scope.dt;
				var time = $scope.mytime;
				var datetime = new Date(date.getFullYear(), 
					date.getMonth(), 
					date.getDate(), 
					time.getHours(), 
					time.getMinutes(), 
					time.getSeconds());
				console.log('Date Time: ', datetime);
				datetime.toUTCString();
				console.log('Converted Date Time: ', datetime);
				// wo.apptDate = Date.now();
				wo.apptDate = datetime;
				console.log('WHTFFF!!', wo);
				wo.status = 'Scheduled';
				console.log('WO', wo);
				wo.$update(function(){
					console.log('Update complete!', wo);

				});
				
  		};

  		$scope.deviceCheckout = function() {
        $modalInstance.close();
        console.log($scope.deviceSN);
        console.log($scope.deviceNotes);
        console.log('workorder: ', workorder);
        console.log('Workorder?? ', $scope.workorder);
        $scope.findWorkOrder();
        $scope.workorder.$promise.then(function(){
	       	console.log($scope.workorder);
	        $scope.workorder.deviceNotes = $scope.deviceNotes;
	        $scope.workorder.deviceSN = $scope.deviceSN;
	        $scope.workorder.$update(function(){
					console.log('Update complete!', $scope.workorder);

				});


        });
    

    };

    //Work Order Authorization Options
    $scope.sendeSign = function() {
    	$modalInstance.close();
  			console.log('Sending eSign');
  	};

  	$scope.eSignHere = function() {
    	$modalInstance.close();
  			console.log('Signing Here');
  			 $scope.findWorkOrder();
        	$scope.workorder.$promise.then(function(){
  			var Id = $scope.workorder._id;
  			// $location.path('/workorderauth/'+Id);
  			window.open('http://'+localhost+':5000/#!/workorderauth/'+Id);
  		});


  	};

  	$scope.printAuth = function() {
    	$modalInstance.close();
  			console.log('Printing Work Auth');
  	};

      	$scope.complete = function() {
  			console.log('Work Order Complete');
  			$modalInstance.close();
  			console.log('Scope.workorder', $scope.workorder);
  			 $scope.findWorkOrder();
       		 $scope.workorder.$promise.then(function(){
	  				var wo = $scope.workorder;
	  				wo.completed = Date.now();
					console.log('WHTFFF!!', wo);
					wo.status = 'Complete';
					wo.techName = $scope.techName;
					console.log('WO', wo);
					wo.$update(function(){
					console.log('Update complete!', wo);
				});

			});
				
  		};

  		$scope.sendingEmail = function() {
  			console.log('Sending Email Now');
  			$modalInstance.close();
  			$scope.findWorkOrder();
       		 $scope.workorder.$promise.then(function(){

  			console.log('Offender: ', $scope.offender);
  			console.log('Work Order: ', $scope.workorder);
  			console.log('User: ', $scope.authentication.user);
  			

  			$scope.workorder.email = $scope.offender.offenderEmail;
		     $scope.workorder.type =  'New Install';
		     $scope.workorder.subject = 'New Install Authorization from Budget Ignition Interlock';
		     $scope.workorder.toWhom = 'Customer';
		     $scope.workorder.serviceCenter = 'Need to get SVC CEnter Name';
		     $scope.workorder.toWhomName =  $scope.offender.firstName+' '+ $scope.offender.lastName;

  			        			$http({
					method: 'post',
					responseType: 'arraybuffer',
					url: '/work/order', 
					data: {
						'user': $scope.authentication.user,
						'offender': $scope.offender,
						'workinfo': $scope.workorder
						
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
				});

			
  		};

      $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
        $scope.offender.assignedShop = $scope.serviceCenter._id;
        $scope.offender.pendingWorkType = $scope.chosen;
        console.log($scope.offender);
        console.log('Service Center Name: ', $scope.serviceCenter.name);
        var shopAddy = $scope.serviceCenter.address+' '+$scope.serviceCenter.city+' '+$scope.serviceCenter.state+' '+$scope.serviceCenter.zipcode;
        console.log('Service Addy: ', shopAddy);
        

        $scope.workOrder = {
        	email: $scope.emailAddress,
        	type: $scope.chosen,
        	subject: $scope.emailSubject,
        	content: $scope.emailText,
        	toWhom: $scope.sendTo,
        	serviceCenter: $scope.serviceCenter.name,
        	svcAddress: shopAddy,
        	toWhomName: $scope.toWhomName

        };
        console.log($scope);

        

        	//Save New Work Order
        		var workorder = new Workorders ({
				serviceCenter: $scope.serviceCenter.name,
				svcAddress: shopAddy,
				offender: $scope.offender._id,
				type: $scope.chosen,
				shopId: $scope.serviceCenter._id
				
			});

        		console.log('Work Order: ', workorder);
			// Redirect after save
			workorder.$save(function(response) {
					$scope.workOrder._id = response._id;
					$scope.offender.pendingWorkOrder = response._id;
        			$scope.offender.$update();



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

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});


      };


      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };




 $scope.today = function() {
        return $scope.dt = new Date();
      };
      $scope.today();
      $scope.showWeeks = true;
      $scope.toggleWeeks = function() {
        return $scope.showWeeks = !$scope.showWeeks;
      };
      $scope.clear = function() {
        return $scope.dt = null;
      };
      $scope.disabled = function(date, mode) {
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      };
      $scope.toggleMin = function() {
        var _ref;
        return $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
          "null": new Date()
        };
      };
      $scope.toggleMin();
      $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return $scope.opened = true;
      };
      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 7
      };
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = $scope.formats[0];
   

$scope.mytime = $scope.dt;
      $scope.hstep = 1;
      $scope.mstep = 5;
      $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
      };
      $scope.ismeridian = true;
      $scope.toggleMode = function() {
        return $scope.ismeridian = !$scope.ismeridian;
      };


      $scope.update = function() {
        var d;
        d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        return $scope.mytime = d;
      };

      $scope.changed = function() {
        return //////////console.log('Time changed to: ' + $scope.mytime);
      };

      return $scope.clear = function() {
        return $scope.mytime = null;
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
	// 	$scope.$scope = function() {
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