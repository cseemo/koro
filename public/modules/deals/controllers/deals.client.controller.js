'use strict';

// Deals controller
angular.module('deals').controller('DealsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Leads', 'Deals', '$http', '$filter', '$sce', 'Users', 
	function($scope, $stateParams, $location, Authentication, Leads, Deals, $http, $filter, $scem, Users) {

var init;

$scope.authentication = Authentication;
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

$scope.pdf = false;
$scope.step = 1;
$scope.currentDeal=0;



//$scope.myiframe = 'blob:http%3A//localhost%3A3000/d43e67f4-bab2-4778-b97c-6385c4b158a8';
$scope.pending=false;
$scope.sending=false;
$scope.finished=false;

$scope.nextStep = function(){
var current = $scope.step-0+1;
//console.log('Current: ',current);
$scope.step = current;
//console.log('Current Step: ',$scope.step);
};

$scope.mycontent = {};

$scope.lastStep = function(){
var current = $scope.step-1;

$scope.step = current;
//console.log('Current Step: ',$scope.step);
};

	$scope.makePDF = function(){

		$scope.step = 3;
		$scope.spinny = true;
		var deal = $scope.deal;
		//console.log('Loas Signed?', deal.loa_signed);

		if(deal.loa_signed!='YES'){

		deal.updated = Date.now();
		//console.log('My Deal: %o',deal);
		deal.stage=$scope.myDealstages[2].name;
		deal.stagenum=$scope.myDealstages[2].value;
		var dealId = $scope.deal._id;
		var signDate = new Date();
		var month = signDate.getMonth();
		var year = signDate.getYear();
		var day = signDate.getDay();
		//console.log('signdate: %o',signDate);
		//console.log('mydate: '+month+'/'+day+'/'+year);
		var testdate = $filter('date')(signDate, 'MM/dd/yyyy');
		//console.log(testdate);
		deal.signDate = testdate;
		//console.log('Deal.user %o',deal.user);
		deal.loa_signed='YES';

		//deal.user.notifications.push({note: deal.companyname+' signed their LOAS'});
			    	
		deal.$update(function(data) {
			//console.log('Deal Updating',data);
		
		// }).$promise(function() {
		// 	//console.log('Promising');
		}).then(function(data, response, status, headers) {
			//console.log('done');
				//console.log('Deal Updated - SUCCESS: ',data);
				////console.log('Data.Response: %o',data._id);
					 $http({method: 'GET', url: '/pdf/'+dealId, responseType: 'arraybuffer'}).
    					success(function(response) {
    
     					var file = new Blob([response], {type: 'application/pdf'});
     					var fileURL = URL.createObjectURL(file);
     					//window.open(fileURL);


     					$scope.mycontent = $sce.trustAsResourceUrl(fileURL);
     					$scope.pdf = true;
     					//window.open(fileURL);

			    }).then(function(){
			    	$scope.spinny = false;
			    	//console.log(deal.companyname+' signed their LOAS');


			    	//console.log('Ready to send Signed LOAs -- just type the damn code!');

			    });
	
		});





		// .success(function(data, status) {
		// 	//console.log('Success!');
		// });

			// if(status === 200) {
			// 	//$scope.currentPrice = data.price;
			// 	//console.log('Deal Updated - SUCCESS: ',data);
			// 	//console.log('Data.Response: %o',data._id);
			// 		 $http({method: 'GET', url: '/pdf/'+dealId+'?name='+name, responseType: 'arraybuffer'}).
   //  					success(function(data, status, headers, config) {
    
   //   					var file = new Blob([data], {type: 'application/pdf'});
   //   					var fileURL = URL.createObjectURL(file);
   //   					window.open(fileURL);

			//     }).
			//     error(function(data, status, headers, config) {
			//       // called asynchronously if an error occurs
			//       // or server returns response with an error status.
			//       //console.log('error');
			//     });
	



			// }	
			//});
				}else{
					window.alert("What the fudge??");


				}


			

		};




//Deals Table Shit
	$scope.deals = Deals.query();

  

    $scope.select = function(page) {
    	//console.log('Variable page: ',page);
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
      //console.log('Start '+start+' and End '+end);
      $scope.currentPage = page;
      //console.log('Filtered Deals %o', $scope.filteredDeals);
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
      //console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredDeals = $filter('filter')($scope.deals, $scope.tableData.searchKeywords);

      // {companyname: $scope.tableData.searchKeywords},

      /*$scope.filteredRegistrations = $filter('filter')($scope.registrations, {
        firstName: $scope.searchKeywords,
        lastName: $scope.searchKeywords,
        confirmationNumber: $scope.searchKeywords,
      });*/
      return $scope.onFilterChange();
    };
    $scope.order = function(rowName) {
    	//console.log('Reordering by ',rowName);
    	//console.log('Scope.row ', $scope.row);
      if ($scope.row === rowName) {
        return;
      }
      $scope.row = rowName;
      $scope.filteredDeals = $filter('orderBy')($scope.filteredDeals, rowName);
      //console.log(rowName);
      return $scope.onOrderChange();
    };
    $scope.setCurrentDeal = function(deal) {
      $scope.currentDeal = $scope.filteredDeals.indexOf(deal);
    };

	init = function() {
			//$scope.registrations = Registrations.query();
			//$scope.find();
			$scope.deals.$promise.then(function() {
				$scope.search();
				return $scope.select($scope.currentPage);	
			});
			
		}();





	$scope.buildDTW = function(){
		//console.log('got here %',$scope);
		//console.log('Total Lines: ', $scope.deal);
		$scope.deal.$promise.then(function(){
			//$scope.deal.adl;
		var totlines = parseInt($scope.deal.adl)+1;
		//console.log('Total Lines: %o', totlines);
		//console.log('Existing LineDetails: ', $scope.deal.lineDetails.length);
		
		if($scope.deal.lineDetails.length==0){
			if(totlines<2){
				$scope.deal.lineDetails.push({});
			}else{
				for(var i = 0; i < totlines ; i++) {
					$scope.deal.lineDetails.push({});
				}

			}
		}
			
		});


	};

$scope.myDealstages = [
{name: 'Pending Rep Review', value: '0', number: 0},
{name: 'LOAs Out for Signature', value: '10', number: 1},
{name: 'LOAs Signed', value: '20', number: 2},
{name: 'Pending Review', value: '25', number: 3},
{name: 'QC Approved', value: '40', number: 4},
{name: 'Pending Order Number', value: '55', number: 5},
{name: 'Pending Install', value: '70', number: 6},
{name: 'Installed', value: '90', number: 7},
{name: 'Paid', value: '100', number: 8},


];

$scope.mystage = 'Please Choose';



 $scope.getDays = function() {
 	//window.alert("Hi");
	var date = new Date();
	//console.log('Date: ', date);
	//var converted = $scope.deal.converted;
////console.log('date' + date+ ' converted' + converted);
$scope.dayssince = 7;
};

$scope.stub = function(){

	var a = true;

};

$scope.myspeed = $scope.dslspeed;

		$scope.mySpeeds = [
{name: '1.5', value: '1.5Mbps/896Kbps',svalue: '1.5M/896K'},
{name: '3.0', value: '3Mbps/896Kbps',svalue: '3M/896K'},
{name: '7.0', value: '7Mbps/896Kbps',svalue: '7M/896K'},
{name: '7.2', value: '7Mbps/2Mbps',svalue: '7M/2M'},
{name: '7.5', value: '7Mbps/5Mbps',svalue: '7M/5M'},
{name: '12.0', value: '12Mbps/896Kbps',svalue: '12M/896K'},
{name: '12.2', value: '12Mbps/2Mbps',svalue: '12M/2M'},
{name: '12.5', value: '12Mbps/5Mbps',svalue: '12M/5M'},
{name: '20.0', value: '20Mbps/896Kbps',svalue: '20M/896K'},
{name: '20.2', value: '20Mbps/2Mbps',svalue: '20M/2M'},
{name: '20.5', value: '20Mbps/5Mbps',svalue: '20M/5M'},
{name: '40.5', value: '40Mbps/5Mbps',svalue: '40M/5M'},
{name: '40.20', value: '40Mbps/20Mbps',svalue: '40M/20M'},
{name: '60.30', value: '60Mbps/30Mbps',svalue: '60M/30M'},
{name: '80.40', value: '80Mbps/40Mbps',svalue: '80M/40M'},
{name: '100.12', value: '100Mbps/12Mbps',svalue: '100M/12M'},
];

$scope.myTerms = [
{name: '12 Months', value: '1'},
{name: '24 Months', value: '2'},
{name: '36 Months', value: '3'},
//{name: '60 Months', value: '60'},
];

$scope.myModem = [
{name: 'None', value: 'None'},
{name: 'Lease', value: 'Lease'},
{name: 'Purchase', value: 'Purchase'},
];

$scope.myNRC = [
{name: 'No', value: 'No'},
{name: 'Yes', value: 'Yes'},
];

$scope.myCredits = [
{name: '0', value: '$0'},
{name: '100', value: '$100'},
{name: '200', value: '$200'},
{name: '300', value: '$300'},
];

$scope.myIP = [
{name: 'Dynamic', value: 'Dynamic'},
{name: 'Static', value: 'Single Static IP'},
{name: 'StaticBlock', value: 'Block of 8 Static IPs'},
];


$scope.myLOA = [
{name: 'No, Just a Quote', value: 0},
{name: 'Local & Long Distance', value: 1},
{name: 'Local, LD, and Toll Free', value: 2},
];

$scope.mymodem = $scope.myModem[0];
$scope.myterm = $scope.myTerms[2];
$scope.nrc = $scope.myNRC[1];
$scope.mycredits = $scope.myCredits[0];
$scope.myip= $scope.myIP[0];
$scope.loa= $scope.myLOA[0];



$scope.dslspeed = function(){
//console.log('This : %o',this);

return $scope.deal.dslspeed;
};


		// Create new Deal
		$scope.testme = function(){
//window.alert(this.name);
	//console.log('Testing %', $scope);
	var deal = new Deals ({
				name: this.name,
				user: this.user,
				contact: this.contact,
				btn: this.btn
			});
	deal.$save(function(response) {
				$location.path('deals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			//console.log(deal);

		};

		$scope.create = function() {
			window.alert('uh oh');
			var deal = new Deals ({
				name: this.name,
				user: this.user,
				contact: this.contact,
				btn: this.btn
			});
	deal.$save(function(response) {
				$location.path('deals/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			//console.log(deal);
};

		// Remove existing Deal
		$scope.remove = function( deal ) {
			if ( deal ) { deal.$remove();

				for (var i in $scope.deals ) {
					if ($scope.deals [i] === deal ) {
						$scope.deals.splice(i, 1);
					}
				}
			} else {
				$scope.deal.$remove(function() {
					$location.path('deals');
				});
			}
		};

		//confirm Payment
		$scope.confirmPayment = function() {
			var deal = $scope.deal;
			deal.stage=$scope.myDealstages[8].name;
			deal.stagenum=$scope.myDealstages[8].value;
			deal.updated = Date.now();
			
		};

		//confirm Installation
		$scope.confirmInstall = function() {
			var deal = $scope.deal;
			deal.stage=$scope.myDealstages[7].name;
			deal.stagenum=$scope.myDealstages[7].value;
			deal.updated = Date.now();
			
		};

		//resubmit order after Rep Review
		$scope.resubmit = function() {
			var deal = $scope.deal;
			deal.stage=$scope.myDealstages[3].name;
			deal.stagenum=$scope.myDealstages[3].value;
			deal.updated = Date.now();

		};

		$scope.QCApproved = function() {


			var deal = $scope.deal;
			deal.stage=$scope.myDealstages[4].name;
			deal.stagenum=$scope.myDealstages[4].value;
			deal.updated = Date.now();
			
			$scope.userB = Users.get({ 
				userId: deal.user._id
			}, function() {
				console.log('got userb');
						

			});
			$scope.userB.$promise.then(function(){
				console.log('User to update %o', $scope.userB);
				console.log('moving on...');
				$scope.authentication.userB.notifications.push({
					note: deal.companyname + ' has been QC Approved!!',
					date: deal.updated

		});

				$scope.userB.$update(function() {
				//console.log('Updating Deal before sending Order Packet');
				//$location.path('deals/' + deal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}).then(function() {
			toastr.info(deal.companyname+' has been approved by Quality Control.');
		});

			});
		
			
	};

		//Notify system that CTL Order has been put into SalesForce
		
		$scope.ctlTyped = function() {
			var deal = $scope.deal;
			deal.updated = Date.now();
			deal.stage=$scope.myDealstages[5].name;
			deal.stagenum=$scope.myDealstages[5].value;


		};
		//ASSIGN Centurylink Orer Number and update DEAL
		$scope.assignOrderNumber = function() {
			var deal = $scope.deal;
			deal.updated = Date.now();
			deal.stage=$scope.myDealstages[6].name;
			deal.stagenum=$scope.myDealstages[6].value;


		};

		//Confirm INstallation
		$scope.assignOrderNumber = function() {
			var deal = $scope.deal;
			deal.updated = Date.now();
			deal.stage=$scope.myDealstages[6].name;
			deal.stagenum=$scope.myDealstages[6].value;


		};

		//Reject Order
		$scope.rejectDeal = function(){
				var deal = $scope.deal;
				deal.updated = Date.now();
			deal.stage=$scope.myDealstages[0].name;
			deal.stagenum=$scope.myDealstages[0].value;

		};

		//Assign Deal to a Project Manager - update Mongo
		$scope.assignDeal = function(){

			//console.log('Find USer Info for PM Name %o', Authentication.user);
			var deal = $scope.deal;
			deal.updated = Date.now();
			deal.stage=$scope.myDealstages[3].name;
			deal.stagenum=$scope.myDealstages[3].value;
			deal.projectmanager = Authentication.user.displayName;
			$scope.mystage = $scope.myDealstages[3];
			
			//console.log('Dealcontroller Deal: %o',deal);
			

			deal.$update();
			// function() {
			// 	$location.path('deals/' + deal._id);
			// }, function(errorResponse) {
			// 	$scope.error = errorResponse.data.message;
			// });
			// 	$location.path('deals/' + deal._id + '/edit');
		};

		//Submit Order Packet
			$scope.submitOrder = function() {
			toastr.info('Submitting Order and Sending Order Packet...');

			$scope.pending=true;
			//$scope.step=5;
			var deal = $scope.deal;
			deal.updated = Date.now();
			//console.log('Look for deal.stage and deal.stagenum %o', $scope);
			if($scope.mystage){
			deal.stage=$scope.mystage.name;
			deal.stagenum=$scope.mystage.value;
			}else{
			deal.stage=$scope.myDealstages[1].name;
			deal.stagenum=$scope.myDealstages[1].value;
			}
			//console.log('Dealcontroller Deal: %o',deal);
			deal.$update(function() {
				//console.log('Updating Deal before sending Order Packet');
				//$location.path('deals/' + deal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}).then(function() {
				//console.log('Deal Updated??');
				toastr.success('Order submitted successfully for '+$scope.deal.companyname+'.');

				$scope.pending=false;

				$scope.sending=true;

				console.log('URL to Post to: ', '/convertingdeals/'+deal._id);

		$http({
		method: 'post',
		url: '/convertingdeals/'+deal._id,
		data: {
			mylead: deal._id,
			term: deal.term,
			dslspeed: deal.dslspeed,
			adllines: deal.adl,
			full_name: deal.contactname,
			phone: deal.telephone,
			email: deal.contactemail, 
			companyname: deal.companyname, 
			modem: deal.modem,
			nrc: deal.waivenrcs,
			credits: deal.winbackcredits,
			staticIP: deal.staticIP,
			sendloas: 1,
			address: deal.address,
			city: deal.city,
			state: deal.state,
			zip: deal.zipcode,
			numbers: deal.lineDetails[0].number,
			adl_ani: deal.lineDetails
		},
		headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
	})
.success(function(data, status) {
	//$location.path('deals/' + deal._id);
		if(status === 200) {
			//$scope.currentPrice = data.price;
////console.log('Data Returned '+data);
			//$scope.currentPrice = data.price;
			//$scope.currentNRR = data.nrr;
			$scope.sending = false;
			$scope.finished = true;
			$scope.myresponse = data;
			toastr.success('Order packet sent to '+$scope.deal.contactemail+' at '+$scope.deal.companyname+'!');
			$location.path('#!/deals');


//Get Quote Details and Save to Lead Object


}


	})
.error(function(data){
	//console.log('OOps...'+data);
});



			});
		};

		// Update existing Deal
			$scope.update = function() {
			var deal = $scope.deal ;
			deal.updated = Date.now();
			//console.log('Look for deal.stage and deal.stagenum %o', $scope);
			if($scope.mystage){
			deal.stage=$scope.mystage.name;
			deal.stagenum=$scope.mystage.value;
			}
			//console.log('Linedetails?? %o',deal.lineDetails);
			//console.log('Dealcontroller Deal: %o',deal);
			deal.$update(function() {
				$location.path('deals/' + deal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Deals
		$scope.find = function() {
			$scope.deals = Deals.query();
			$scope.today = new Date();

		};

		// Find existing Deal
		$scope.findOne = function() {
			$scope.deal = Deals.get({ 
				dealId: $stateParams.dealId

			});
			//console.log('Deal Info: %o', $scope.deal);
			$scope.mystage = $scope.deal.stage;

			
		};

}]).directive('stats', function($q, $http, Authentication){
	return {
		scope: {},
		restrict: 'AE',
		// replace: true,
		// transclude: true,
		template: '<span>{{mystuff}}</span',
		link: function(scope, element, attrs){
			//console.log('Loading Data');
			//console.log(element);
			//console.log('My attrs', attrs);
			var mytype = attrs.stats;

			switch(mytype) {
				case 'repMRC':
				var statURL = '/stats/deals/mrctotal'
				break;

				case 'repLEADS':
				var statURL = '/stats/leads/total'
				break;

				case 'repDEALS':
				var statURL = '/stats/deals/total'
				break;

				case 'repCALLS':
				var statURL = '/records/calldetails/rep'
				break;
			}

			$http.get(statURL).then(function(result){
				//console.log('Result '+mytype+' :', result);
				if(mytype==='repCALLS'){
					//console.log('Going thru Rep Array now', Authentication.user.displayName);
		Object.keys(result.data).forEach(function(key) {
			//console.log('Actually in the array');
          //console.log('Results Key %o', result.data[key]);
          ////console.log(Authentication.user.displayName);
          //Converted == to === JSLint
          //console.log('Result ID :', result.data[key]._id);
          if(result.data[key]._id===Authentication.user.displayName)
          {
            scope.mystuff = result.data[key].total;
            ////console.log('WE WON, JOHNNY WE WON!!!!',results[key].total);

          }

        });


				}else{
					//console.log('No Array to go thru');
				scope.mystuff = result.data[0].total;	
				}
			

				
				
			});
			//console.log('Getting scope in our directive', scope);

			return scope.mystuff;
	
		}


};
});


// 			]).directive('clock', function($http){
// 	return{
// 		restrict: 'E',
// 		replace: true,
// 		//transclude: true,
// 		scope: {
// 			timezone: '@'
// 			},
// 		controller: function($scope, $element){
// 			//console.log('Element: ',$element);
// 			////console.log('Attrs: ',attrs);
// 			$http.get(url: '/stats/deals/mrctotal',
// 				isArray: true,

// 			$scope.callHandler = function(){

			
// 			}
// 		},
// 		template: '<div ng-click="callHandler()">1pm{{timezone}}</div>'
			
// }});


