'use strict';

// Shops controller
angular.module('shops').controller('ShopsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Shops', '$http', '$filter', '$sce',  
	function($scope, $stateParams, $location, Authentication, Shops, $http, $filter, $sce) {
		$scope.authentication = Authentication;
		//Update Info Button disaled until form is changed
		$scope.updateInfo = false;

		  $scope.step=1;
		  $scope.nextStep = function() {
		  	console.log('Next Step', $scope.step);

		  	$scope.step = +$scope.step+1;
		  	console.log('Step: ', $scope.step);
		  };

		// Create new Shop
		$scope.create = function() {
			// Create new Shop object
			console.log(this);
			var phone = $filter('tel')(this.telephone);
			var altphone = $filter('tel')(this.alttelephone);
			var fax  = $filter('tel')(this.fax);
			var shop = new Shops ({
				name: this.name,
				primarycontactname: this.primarycontactname,
				altcontactname: this.altcontactname,
				telephone: phone,
				fax: fax,
				alttelephone: altphone,
				email: this.email,
				address: this.address,
				city: this.city,
				state: this.state,
				zipcode: this.zipcode,

			});
			console.log('Shop; ', shop);
			// Redirect after save
			shop.$save(function(response) {
				$location.path('shops/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//Send Contract 
		$scope.sendContract = function() {
			console.log('Sending out Contract');
			var shopId = $scope.shop._id;
			console.log(shopId);
					$http({
					    method: 'get',
					    url: '/sendAgreement/'+shopId,
					    responseType: 'arraybuffer',
					    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		
					  })
					.error(function(data) {
						console.log('Error!! ', data);
					})
					.success(function(data, status, headers, config) {
					    if(status === 222) {
					    	console.log('Got it!!');
					    }
					    console.log('Success sending agreement!');
						toastr.success('Success! Email was sent to '+$scope.shop.email);
						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		window.open(fileURL);
     	});

     		




		};

		//Shop Approves Agreement
		$scope.viewAgreement = function() {
			// console.log($scope.shop);
			var shopId = $scope.shop._id;
			$scope.step=3;
			$http({
					    method: 'get',
					    url: '/viewAgreement/'+shopId,
					    responseType: 'arraybuffer',
					    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		
					  })
					.error(function(data) {
						console.log('Error!! ', data);
					})
					.success(function(data, status, headers, config) {

						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		
			     		$scope.mycontent = $sce.trustAsResourceUrl(fileURL);
   					});


		};

		// Remove existing Shop
		$scope.remove = function( shop ) {
			if ( shop ) { shop.$remove();

				for (var i in $scope.shops ) {
					if ($scope.shops [i] === shop ) {
						$scope.shops.splice(i, 1);
					}
				}
			} else {
				$scope.shop.$remove(function() {
					$location.path('shops');
				});
			}
		};

		// Update existing Shop
		$scope.update = function() {
			var shop = $scope.shop ;

			shop.$update(function() {
				$location.path('shops/' + shop._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
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

		// Find a list of Shops
		$scope.find = function() {
			$scope.shops = Shops.query();
		};

		// Find existing Shop
		$scope.findOne = function() {
			$scope.shop = Shops.get({ 
				shopId: $stateParams.shopId
			});
		};
	}
]);