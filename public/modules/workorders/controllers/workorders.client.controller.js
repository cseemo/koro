'use strict';

// Workorders controller
angular.module('workorders').controller('WorkordersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workorders', 'Offenders', 'Payments', '$http', 
	function($scope, $stateParams, $location, Authentication, Workorders, Offenders, Payments, $http ) {
		$scope.authentication = Authentication;

		// Create new Workorder
		$scope.create = function() {
			// Create new Workorder object
			var workorder = new Workorders ({
				name: this.name
			});

			// Redirect after save
			workorder.$save(function(response) {
				$location.path('workorders/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Workorder
		$scope.remove = function( workorder ) {
			if ( workorder ) { workorder.$remove();

				for (var i in $scope.workorders ) {
					if ($scope.workorders [i] === workorder ) {
						$scope.workorders.splice(i, 1);
					}
				}
			} else {
				$scope.workorder.$remove(function() {
					$location.path('workorders');
				});
			}
		};

$scope.approveWorkOrderPayment = function(){

	console.log('Approvign WOrk Order Payment',$stateParams);

	var workorderId = $stateParams.workorderId;

		 $http({
					method: 'post',
					responseType: 'arraybuffer',
					url: '/approve/workorder/'+workorderId, 
					data: {
						'offender': $scope.offender,
						'workinfo': $scope.workorder
						
					}
					
			})
		.success(function(data, status) {
		
		$scope.sending = false;
		$scope.results = true;
		//////console.log('Data from LOA?? %o',data);
		toastr.success('Approval granted...please wait for your signed copy. One will also be emailed to you for your convenience. ');
			

			var file = new Blob([data], {type: 'application/pdf'});
     		var fileURL = URL.createObjectURL(file);
     		window.open(fileURL);
			

			});
	};

		// Update existing Workorder
		$scope.update = function() {
			var workorder = $scope.workorder ;

			workorder.$update(function() {
				$location.path('workorders/' + workorder._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Workorders
		$scope.find = function() {
			console.log('Found Workorders');
			$scope.workorders = Workorders.query();
		};

		// Find existing Workorder
		$scope.findOne = function() {
			$scope.workorder = Workorders.get({ 
				workorderId: $stateParams.workorderId
			});
			console.log('Found our Workorder Offender:  ', $scope.workorder);

				$scope.workorder.$promise.then(function(){

					console.log('Going after our OFfender');
					console.log('Found our Workorder Offender:  ', $scope.workorder.offender);


					var offender = Offenders.get({ 
				offenderId: $scope.workorder.offender
			});
					$scope.offender = offender;
				console.log('What did we get back..', $scope.offender);

			});
		};
	}
]).controller('WorkOrderApprovalController', ['$scope', '$stateParams', '$location', 'Shops', '$http', '$filter', '$sce', 'Workorders', 'Payments', 'Offenders',  
	function($scope, $stateParams, $location, Shops, $http, $filter, $sce, Workorders, Payments, Offenders) {
		
		//Update Info Button disaled until form is changed
		$scope.updateInfo = false;
		

		  $scope.step=1;
		  $scope.nextStep = function() {
		  	// console.log('Next Step', $scope.step);

		  	$scope.step = +$scope.step+1;
		  	// console.log('Step: ', $scope.step);
		  };



			// Update existing Shop
		$scope.updateAgreement = function() {
			var shop = $scope.shop ;

			shop.$update(function() {
				// $location.path('shops/' + shop._id);
				toastr.success('Your information has been updated');
				// $scope.step=3;
				$scope.updateInfo = false;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//Charge Credit Card for Work order
		var chargeCard = function (wo, off){
			console.log('Charging Credit Card Now', $scope.offender);
			var pmt = Payments.query({workorder: wo._id});
   						pmt.$promise.then(function(){
   						console.log('Got payment...', pmt);

   						});


						$http({
					    method: 'post',
					    url: '/chargeCard/'+wo._id,
					    data: {
					    	offender: off
					    }
					    
		
					  })
					.error(function(data) {
						console.log('Error!! ', data);
						toastr.error(data.error.message);
						// var pmt = Payments.get({workorder: wo._id});
   			// 			pmt.$promise.then(function(){
   							pmt = pmt[0];
   							pmt.notes = 'Payment Error via Portal: '+data.error.message;
	   						// console.log('Do we still have payment? - can we Add AuthCode and update status', pmt);
	   						pmt.status = 'Due';
	   						// pmt.authCode = authCode;
	   						pmt.$update();
	   		// 			});
					})
					.success(function(data, status, headers, config) {
						console.log('Data From Charge: ', data.directResponse);
						var resp = data.directResponse.split(',');
						console.log('4', resp[4]);
						console.log('Trans Type (11)', resp[11]);
						console.log('Trans Type (12)', resp[12]);
						console.log('OR -- Trans Type (13)', resp[13]);
						var amount = resp[9];
						var description = resp[3];
						var authCode = resp[4];
						toastr.success(description+' on '+resp[51]+resp[50]+' for $'+amount+'. Authorization Code: '+authCode);
   						wo.authCode = authCode;
   						wo.pmtStatus = 'Paid';
   						wo.amount = amount;
   						wo.$update();


						// var pmt = Payments.get({workorder: wo._id});
   			// 			pmt.$promise.then(function(){
   							pmt = pmt[0];
   							pmt.notes = 'AutoPaid: '+description+' on '+resp[51]+resp[50]+' for $'+amount+'. Authorization Code: '+authCode;
	   						console.log('Do we still have payment? - can we Add AuthCode and update status', pmt);
	   						pmt.status = 'Paid';
	   						pmt.authCode = authCode;
	   						pmt.$update();
	   					// });

   						})
   						

			
		};

		//Create Manual Payment 
				var createPayment = function (wo, off){
			console.log('Creating Manual Payment Now', $scope.offender);
				console.log('Workorder', wo);
			if(wo && wo.amount > 0){


				
        	//Create New Payment
        		var pmt = new Payments ({
				workorder: wo._id,
				pmtType: wo.type,
				offender: off._id,
				status: 'Due',
				notes: 'Pending Workorder -- Payment Due', 
				amount: wo.amount
				
			});

        		
			// Redirect after save
			pmt.$save(function(response) {
					console.log('Response from saving PMT: ', response);

        		

   						wo.pmtStatus = 'Due';
   						wo.amount = wo.amount;
   						wo.$update();

   					});

			}
		};


	

						//Shop Signs Agreement
		$scope.signAgreement = function() {
			toastr.success('Congratrulations, you have eSigned the documents.');
			var Id = $scope.workorder._id;
			var workorder = $scope.workorder;
			workorder.authSigned = Date.now();
			var shop = $scope.shop;
			
			workorder.$update().then(function(){
			
			$http({
					    method: 'post',
					    url: '/approve/workorder/'+Id,
					    responseType: 'arraybuffer',
					    // headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
					    data: {
					    	workinfo: workorder,
					    	offender: $scope.offender
					    }
		
					  })
					.error(function(data) {
						console.log('Error!! ', data);
					})
					.success(function(data, status, headers, config) {
						$scope.hideeSign=true;
						console.log('Step = ',$scope.step);
						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		console.log('line 208 work');
			     		$scope.mycontent = $sce.trustAsResourceUrl(fileURL);
			     		$scope.step=3;
			     		
			     		
			     		if($scope.offender.merchantCustomerId && $scope.offender.paymentProfileId){
			     			console.log('line 235 work');
			     			// console.log('Length of Card Number: ', $scope.offender.cardNumber.length);
			     			console.log('We are charging this guy because: ', $scope.offender);
			     			console.log('Workorder in question: ', workorder);
			     			chargeCard(workorder, $scope.offender);
			     		} else {
			     			// createPayment(workorder, $scope.offender);
			     		}
			     		
   					});

			});
		};

		$scope.viewAgreement = function() {
			// console.log($scope.shop);
			console.log('Viewing Agreement now');
			// var shop = $scope.shop;
			// console.log(shop.signer+' '+shop.signertitle);
			// shop.$update().then(function(){

			// var shopId = $scope.shop._id;
			console.log('Viewing Agreement');
			console.log('Work ORder: ', $scope.workorder);
			console.log('Offender: ', $scope.offender);
			var Id = $scope.workorder._id;

			$scope.step=3;
			 $http({
					method: 'post',
					responseType: 'arraybuffer',
					// url: '/approve/workorder/'+Id,
					url: '/viewWorkOrder/'+Id, 
					data: {
						'offender': $scope.offender,
						'workinfo': $scope.workorder
						
					}
					
			})

			// $http({
			// 		    method: 'post',
			// 		    url: '/viewWorkOrder/'+Id,
			// 		    responseType: 'arraybuffer',
			// 		    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
			// 		    data: {
			// 			// 'offender': $scope.offender,
			// 			'workinfo': $scope.workorder
			// 			}
		
			// 		  })
			// 		.error(function(data) {
			// 			console.log('Error!! ', data);
			// 		})
					.success(function(data, status, headers, config) {
						console.log('Got pdf');
						console.log('Step = ',$scope.step);
						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		
			     		$scope.mycontent = $sce.trustAsResourceUrl(fileURL);
   					});

				


		};




		// Find existing Shop
		$scope.findOne = function() {
			$scope.workorder = Workorders.get({ 
				workorderId: $stateParams.workorderId
			});
			console.log('Found our Workorder:  ', $scope.workorder);


				$scope.workorder.$promise.then(function(){

					console.log('Going after our OFfender');
					console.log('Found our Workorder Offender:  ', $scope.workorder.offender);


					var offender = Offenders.get({ 
				offenderId: $scope.workorder.offender
			});
					$scope.offender = offender;

				console.log('What did we get back..', $scope.offender);
					$scope.offender.$promise.then(function() {
					$scope.displayName = offender.firstName+' '+offender.lastName;
					console.log($scope.displayName);


					});

			});

		};
	}

]);