'use strict';

// Workorders controller
angular.module('workorders').controller('WorkordersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Workorders', 'Offenders', '$http', 
	function($scope, $stateParams, $location, Authentication, Workorders, Offenders, $http ) {
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
]);