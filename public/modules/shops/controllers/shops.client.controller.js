'use strict';

// Shops controller
angular.module('shops').controller('ShopsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Shops', '$http', '$filter', '$sce', '$timeout', '$modal', '$rootScope', 
	function($scope, $stateParams, $location, Authentication, Shops, $http, $filter, $sce, $timeout, $modal, $rootScope) {
		$scope.authentication = Authentication;
		//Update Info Button disaled until form is changed
		  $scope.deviceType = 'Unknown';
		  $rootScope.showEdits = false;
		  $scope.shopStatus = '';
		  $scope.signManual = function() {
		  	$scope.signedManual = true;
		  };

		  //Date Picker stuff

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
      $scope.open = function($event) {
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


      $scope.updateTime = function() {
        var d;
        d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        return $scope.mytime = d;
      };


      //Serivce Center Table Stuff

  $scope.tableData = {
      searchKeywords: '',
    };
    $scope.filteredDeals= [];
    $scope.row = '';
    $scope.numPerPageOpt = [3, 5, 10, 20];
    $scope.numPerPage = $scope.numPerPageOpt[2];
    $scope.currentPage = 1;
    //$scope.currentPageDeals= $scope.getinit;
    $scope.currentPageDeals= [];



    $scope.select = function(page) {
    	//////////////console.log('Variable page: ',page);
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
      //////////////console.log('Start '+start+' and End '+end);
      $scope.currentPage = page;
      //////////////console.log('Filtered Deals %o', $scope.filteredDeals);
      return $scope.currentPageDeals = $scope.filteredDeals.slice(start, end);

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
      $scope.filteredDeals = $filter('filter')($scope.shops, $scope.tableData.searchKeywords);

      // {companyname: $scope.tableData.searchKeywords},

      /*$scope.filteredRegistrations = $filter('filter')($scope.registrations, {
        firstName: $scope.searchKeywords,
        lastName: $scope.searchKeywords,
        confirmationNumber: $scope.searchKeywords,
      });*/
      return $scope.onFilterChange();
    };

     $scope.searchRep = function() {
      //////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredDeals = $filter('filter')($scope.shops, $scope.authentication.user._id);

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
      $scope.filteredDeals = $filter('orderBy')($scope.filteredDeals, rowName);
      //////////////console.log(rowName);
      return $scope.onOrderChange();
    };
    $scope.setCurrentDeal = function(shop) {
      $scope.currentDeal = $scope.filteredDeals.indexOf(shop);
    };

	// init = function() {
	// 		//$scope.registrations = Registrations.query();
	// 		//$scope.find();
	

	// 		$scope.deals.$promise.then(function() {
	// 			$scope.search();
	// 			return $scope.select($scope.currentPage);
	// 			});	
	// 	}();


      //Set service center as signed up per Rep -- manual contract uploaded
     
      $scope.signedUp = function() {
      	var shop = $scope.shop;
      	shop.signDate = $scope.dt;
      	console.log('Sign Date: ', shop.signDate);
      	shop.$update().then(function(){
      		toastr.success(shop.name+' has been signed up...please make sure to upload the signed contract.');
      	});


      };
		//Check type of Device
// 		$scope.deviceCheck = function() {
// 			console.log('Checking Device! ', Date.now());
// 			var standalone = window.navigator.standalone,
//     userAgent = window.navigator.userAgent.toLowerCase(),
//     safari = /safari/.test( userAgent ),
//     ios = /iphone|ipod|ipad/.test( userAgent );

// if( ios ) {
// 	console.log('IOS');
// 	 $rootScope.showEdits = true;
    
//     if ( !standalone && safari ) {

        
//         $scope.deviceType = 'IOS Browser';
        
//     } else if ( standalone && !safari ) {
        
//          $scope.deviceType = 'IOS Standalone';
        
//     } else if ( !standalone && !safari ) {
        
//         $scope.deviceType = 'IOS uiwebview';
        
//     };
    
// } else {
//     console.log('Not IOS');
//     $scope.deviceType = 'Not iOS';
//      $rootScope.showEdits = false;
    
//     }
// };



		// Create new Shop
		$scope.create = function() {
			// Create new Shop 
			console.log('Createing new shop!!');
			console.log(this);
			var phone;
			var altphone;
			var fax;
			var techphone;



			if(!this.telephone){
				phone = 'Telephone Number';
			}else{

			phone = $filter('tel')(this.telephone);
			}
			if(!this.altphone){
				altphone = 'Alternate Telephone Number';
			}else{

			altphone = $filter('tel')(this.altphone);
			}
			if(!this.fax){
				fax = 'Fax Number';
			}else{

			fax = $filter('tel')(this.fax);
			}
			if(!this.techphone){
				techphone = 'Tech Phone Number';
			}else{

			techphone = $filter('tel')(this.techphone);
			}
			console.log('Phone is: ', phone);
			console.log('TechPhone is: ', techphone);
			console.log('AltPhone is: ', altphone);
			console.log('Fax is: ', fax);

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


		//saveUpload
		$scope.saveUpload = function(id, desc) {
			console.log('Save upload, ', id);
			console.log(desc);
						$http({
					    method: 'post',
					    url: '/dlupload/'+id,
					    data: {
					    	description: desc
					    }
					})
					.error(function(err, status) {
						// console.log('Error!! ERr ', err);
						// console.log('Error!!  RESP', err.name);
						// console.log('Error Message: ', err.message);
						toastr.warning('Error Saving Upload Information', err);
					})
					.success(function(data, status, headers, config) {
						console.log('Upload info was saved');
					    
					});
			

		};


		//Delete File
		$scope.deleteFile = function(id, row) {
			$scope.myUploads.splice(row, 1);
			console.log('Delete File ID: '+id+' at: '+row);
			$http({method: 'GET', url: '/removefile/'+id}).
			error(function(err, status) {
				console.log("ERROR!!! ", err);
				console.log("ERROR STATUS!", status);
			}).
    		success(function(response, data) {
    			console.log('Response: ', response);

    			// $rootScope.getUploads($scope.shop._id);
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
					.error(function(err, status) {
						// console.log('Error!! ERr ', err);
						// console.log('Error!!  RESP', err.name);
						// console.log('Error Message: ', err.message);
						toastr.warning('Email Error: Is the email a valid address?');
					})
					.success(function(data, status, headers, config) {
					    // console.log('Status ', status);
					    // console.log('Success sending agreement!', data);
						toastr.success('Success! Email was sent to '+$scope.shop.email);
						var file = new Blob([data], {type: 'application/pdf'});
			     		 $scope.fileURL = URL.createObjectURL(file);
			     		 $scope.seeSA = true;
			     		 $timeout(function(){
								////console.log('Going to Change');
							$scope.seeSA = false;
							$scope.shop.agreementSent = 'true';
							$scope.shop.$update();
							}, 10000);	     		
     				});
		};


		//Counter-Sign Service Agreement
		$scope.counterSignShopAgreement = function() {
			var id = $scope.shop._id;
			$http({method: 'GET', url: '/countersign/'+id,
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
					    // console.log('Success sending agreement!');
						toastr.success('Counter-signed agreement sent to '+$scope.shop.email);
						var file = new Blob([data], {type: 'application/pdf'});
			     		 $scope.fileURL = URL.createObjectURL(file);
			     		 $scope.seeSA = true;
			     		 $timeout(function(){
								////console.log('Going to Change');
							$scope.seeSA = false;
							$scope.shop.counterSigned = 'true';
							$scope.shop.$update();
							}, 10000);

			     		
     	})
		};

		//Get Uploads associated with this SHop
		$rootScope.getUploads = function(id) {
			console.log('Getting Uploads', id);
			$http({method: 'GET', url: '/uploads/'+id}).
    		success(function(response, data) {
    			// console.log('Success', response);
    			// console.log('Data', data);
    			if(response.length<1){
    				console.log('No Uploads');
    				$scope.myUploads = null;

    			}else{

    				$scope.myUploads = response;
    				if(response.length>2){
    				// console.log('How many images? and How many files?');
    				var numImages = 0;
    				var numFiles = 0 ;
    				angular.forEach(response, function(value, key) {
    					// console.log('Key: '+key+' and Value: '+value);
    					// console.log('Value Details %o', value);
    					var filetype = value.FileName.substr(value.FileName.length-4);
    					// console.log('File Type: ', filetype);
    					if(filetype==='.pdf'){
    						numFiles++;
    					}else{
    						numImages++;
    					}

    					

    				});
    				// console.log('Images: '+numImages+', Files: '+numFiles);
    					if(numImages>2){
    						// console.log('Assuming they have all the images');
    						$scope.havePhotos = true;
    					}else{
    						$scope.havePhotos = false;
		
    					}
    					if(numFiles>1){
    						// console.log('Assume we have both Insurance/Lease');
    						$scope.haveFiles = true;
    					}else{
    						$scope.haveFiles = false;
    					}
    					if(numImages>2 && $scope.shop.signDate && numFiles >1){
    						console.log('This shop is complete!');
    						$scope.shop.complete = 'true';
    						$scope.shop.$update();
    					}

    					
    					}
    					



    			}
    		
			    }).then(function(){
			    	// console.log('Then we go here and show those documents');
			    });




    			
    			

		};

		$scope.states=[
		{name: "Alabama", abr: "AL"},
		{name: "Alaska", abr: "AK"},
		{name: "Arizona", abr: "AZ"},
		{name: "Arkansas", abr: "AR"},
		{name: "California", abr: "CA"},
		{name: "Connecticut", abr: "CT"},
		{name: "Colorado", abr: "CO"},
		{name: "Delaware", abr: "DE"},
		{name: "Florida", abr: "FL"},
		{name: "Georgia", abr: "GA"},
		{name: "Hawaii", abr: "HI"},
		{name: "Idaho", abr: "ID"},
		{name: "Illinois", abr: "IL"},
		{name: "Indiana", abr: "IN"},
		{name: "Iowa", abr: "IA"},
		{name: "Kansas", abr: "KS"},
		{name: "Kentucky", abr: "KY"},
		{name: "Louisiana", abr: "LA"},
		{name: "Maine", abr: "ME"},
		{name: "Maryland", abr: "MD"},
		{name: "Massachusetts", abr: "MA"},
		{name: "Michigan", abr: "MI"},
		{name: "Minnesota", abr: "MN"},
		{name: "Mississippi", abr: "MS"},
		{name: "Missouri", abr: "MO"},
		{name: "Montana", abr: "MT"},
		{name: "Nebraska", abr: "NB"},
		{name: "Nevada", abr: "NV"},
		{name: "New Hampshire", abr: "NH"},
		{name: "New Jersey", abr: "NJ"},
		{name: "New Mexico", abr: "NM"},
		{name: "New York", abr: "NY"},
		{name: "North Dakota", abr: "ND"},
		{name: "North Carolina", abr: "NC"},
		{name: "Ohio", abr: "OH"},
		{name: "Oklahoma", abr: "OK"},
		{name: "Oregon", abr: "OR"},
		{name: "Pennsylvania", abr: "PA"},
		{name: "Rhode Island", abr: "RI"},
		{name: "South Carolina", abr: "SC"},
		{name: "South Dakota", abr: "SD"},
		{name: "Tennessee", abr: "TN"},
		{name: "Texas", abr: "TX"},
		{name: "Utah", abr: "UT"},
		{name: "Vermont", abr: "VT"},
		{name: "Virginia", abr: "VI"},
		{name: "Washington", abr: "WA"},
		{name: "West Virginia", abr: "WV"},
		{name: "Wisconsin", abr: "WI"},
		{name: "Wyoming", abr: "WY"}];
		



		$scope.saveMe = function() {
			console.log('Save it!!');
			$scope.shop.$update().then(function(){
				console.log('Saved');
			});


		};




		 $scope.enableEdit = function() { $scope.edit = true; }
    $scope.disableEdit = function() { $scope.edit = false;  }

    $scope.sendPortal = function(){
    		console.log('Sending Portal for Shop ', $scope.shop);
			$http({
					    method: 'post',
					    url: '/sendShopInvite/',
					    // responseType: 'arraybuffer',
					    data: {
					    	email: $scope.emailTo,
					    	shop: $scope.shop
					    },
					    // headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
					 })
					.error(function(err, status) {
						// console.log('Error!! ERr ', err);
						// console.log('Error!!  RESP', err.name);
						// console.log('Error Message: ', err.message);
						toastr.warning('Email Error: Is the email a valid address?');
					})
					.success(function(data, status, headers, config) {
					    // console.log('Status ', status);
					    // console.log('Success sending agreement!', data);
						toastr.success('Success! Email was sent to '+$scope.shop.email);
						var file = new Blob([data], {type: 'application/pdf'});
			     		 $scope.fileURL = URL.createObjectURL(file);
			     		 $scope.seeSA = true;
			     		 $timeout(function(){
								////console.log('Going to Change');
							$scope.seeSA = false;
							$scope.shop.agreementSent = 'true';
							$scope.shop.$update();
							}, 10000);	     		
     				});
		};

		//Download an Uploaded File
		$scope.dlUpload = function(id, name) {
			console.log('Downloading File', id);
			console.log('Name: ', name);
			var dltype;
			var filetype = name.substr(name.length-4)
			filetype = filetype.toLowerCase();
			console.log('File Type: ', filetype);
			if(filetype==='.jpg'){
				dltype = 'image/jpg';
			}else 
			if(filetype==='.png'){
				dltype = 'image/png';
			}else 
			if(filetype==='jpeg'){
				dltype = 'image/jpeg';
			}else 
			if(filetype==='.pdf'){
				dltype = 'application/pdf';
			}
			
			console.log('Type: ', dltype);
			$http({method: 'GET', url: '/dlUpload/'+id, responseType: 'arraybuffer'}).
    		success(function(response, data) {
    			var file = new Blob([response], {type: dltype});
     		var fileURL = URL.createObjectURL(file);

     		window.open(fileURL);


			    }).then(function(){
			    	console.log('We have proceeded');
			    });


		};

		//Open Hours of Operation
			$scope.setHours = function() {
			var modalInstance;
		modalInstance = $modal.open({
          templateUrl: 'hoursModal.html',
          controller: 'shopModalInstanceCtrl',
          resolve: {
            shop: function() {
              return $scope.shop;
            }
        }
      });
		console.log('Hours Modal Opened');
		};

		//Open Modal
		$scope.uploadPhotos = function() {
			var modalInstance;
		modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'shopModalInstanceCtrl',
          resolve: {
            shop: function() {
              return $scope.shop;
            }
        }
      });
		console.log('Modal Opened');
		};


		//View Agreement
		$scope.seeAgreement = function() {
			console.log('See Agreement!');
			window.open($scope.fileURL);
		}



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

			//Download Signed Service Agreement
	$scope.downloadSA = function(id){
		//console.log('ID: ', id);
		//console.log('Donwloading LOA now', $scope.deal._id);
		$http({method: 'GET', url: '/downloadPDF/'+id, responseType: 'arraybuffer'}).
    		success(function(response) {
    			//console.log('Success');
    				var file = new Blob([response], {type: 'application/pdf'});
     		var fileURL = URL.createObjectURL(file);

     		window.open(fileURL);

			    }).then(function(){
			    	//console.log('Then we go here');
			    });



	};


	

		// Find a list of Shops
		$scope.find = function() {
			$scope.shops = Shops.query();

			$scope.shops.$promise.then(function() {
				$scope.search();
				return $scope.select($scope.currentPage);
				});	
		};

		$scope.checkEmail = function(){
			$scope.showEmail=true;
			// console.log('Shop: ', $scope.shop);
			if($scope.shop.email){
				// console.log('Has an email ', $scope.shop.email);
				$scope.emailTo = $scope.shop.email;
			}

		};
		// Find existing Shop
		$scope.findOne = function() {

			$scope.shop = Shops.get({ 
				shopId: $stateParams.shopId
			});
			
			$scope.getUploads($stateParams.shopId);
		};
	}
	]).controller('shopModalInstanceCtrl', [
    '$scope', '$modalInstance', '$http', 'FileUploader', 'shop', '$rootScope', function($scope, $modalInstance, $http, FileUploader, shop, $rootScope) {

    	console.log('Shop is', shop);
    	$scope.shop = shop;
    	$scope.close = function(){
    		$modalInstance.close();

    	};

     	var uploader = $scope.uploader = new FileUploader({
            url: '/upload/shop/'+$scope.shop._id
        });

        // FILTERS

        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|pdf|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            // console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            // console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            // console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            // console.info('onBeforeUploadItem', item);

        };
        uploader.onProgressItem = function(fileItem, progress) {
            // console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            // console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            // console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            // console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            // console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            // console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            // console.info('onCompleteAll');
            toastr.success('Your files have been uploaded');
            $modalInstance.close();
            // console.log(shop._id);
            $rootScope.getUploads(shop._id);


        };

        // console.info('uploader', uploader);





 }]).controller('ShopsApprovalController', ['$scope', '$stateParams', '$location', 'Shops', '$http', '$filter', '$sce',  
	function($scope, $stateParams, $location, Shops, $http, $filter, $sce) {
		
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

						//Shop Signs Agreement
		$scope.signAgreement = function() {
			toastr.success('Congratrulations, you have eSigned the documents.');
			var shopId = $scope.shop._id;
			var shop = $scope.shop;
			shop.signDate = Date.now();
			shop.$update().then(function(){
			
			$http({
					    method: 'get',
					    url: '/signAgreement/'+shopId,
					    responseType: 'arraybuffer',
					    headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		
					  })
					.error(function(data) {
						console.log('Error!! ', data);
					})
					.success(function(data, status, headers, config) {
						
						console.log('Step = ',$scope.step);
						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		
			     		$scope.mycontent = $sce.trustAsResourceUrl(fileURL);
			     		$scope.step=3;
			     		$scope.hideeSign=true;
   					});

			});
		};

		$scope.viewAgreement = function() {
			console.log($scope.shop);

			var shop = $scope.shop;
			console.log(shop.signer+' '+shop.signertitle);
			shop.$update().then(function(){

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
						console.log('Got pdf');
						console.log('Step = ',$scope.step);
						var file = new Blob([data], {type: 'application/pdf'});
			     		var fileURL = URL.createObjectURL(file);
			     		
			     		$scope.mycontent = $sce.trustAsResourceUrl(fileURL);
   					});

				});


		};




		// Find existing Shop
		$scope.findOne = function() {
			$scope.shop = Shops.get({ 
				shopId: $stateParams.shopId
			});
		};
	}

]);