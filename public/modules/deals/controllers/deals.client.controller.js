'use strict';

// Deals controller
angular.module('deals').controller('DealsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Leads', 'Deals', '$http', '$filter',
	function($scope, $stateParams, $location, Authentication, Leads, Deals, $http, $filter) {
		$scope.authentication = Authentication;
		
$scope.step = 1;
//$scope.myiframe = 'blob:http%3A//localhost%3A3000/d43e67f4-bab2-4778-b97c-6385c4b158a8';
$scope.pending=false;
$scope.sending=false;
$scope.finished=false;
$scope.nextStep = function(){
var current = $scope.step-0+1;
console.log('Current: ',current);
$scope.step = current;
console.log('Current Step: ',$scope.step);
};

$scope.lastStep = function(){
var current = $scope.step-1;

$scope.step = current;
console.log('Current Step: ',$scope.step);
};



	$scope.makePDF = function(){

		$scope.step = 3;
		$scope.spinny = true;
		var deal = $scope.deal;
		deal.updated = Date.now();
		console.log('My Deal: %o',deal);
		deal.stage=$scope.myDealstages[2].name;
		deal.stagenum=$scope.myDealstages[3].value;
		var dealId = $scope.deal._id;
		var signDate = new Date();
		var month = signDate.getMonth();
		var year = signDate.getYear();
		var day = signDate.getDay();
		console.log('signdate: %o',signDate);
		console.log('mydate: '+month+'/'+day+'/'+year);
		var testdate = $filter('date')(signDate, 'MM/dd/yyyy');
		console.log(testdate);
		deal.signDate = testdate;

		deal.$update(function(data) {
			console.log('Deal Updating',data);
		
		// }).$promise(function() {
		// 	console.log('Promising');
		}).then(function(data, response, status, headers) {
			console.log('done');
				console.log('Deal Updated - SUCCESS: ',data);
				//console.log('Data.Response: %o',data._id);
					 $http({method: 'GET', url: '/pdf/'+dealId, responseType: 'arraybuffer'}).
    					success(function(data, status, headers, config) {
    
     					var file = new Blob([data], {type: 'application/pdf'});
     					var fileURL = URL.createObjectURL(file);
     					window.open(fileURL);

			    }).then(function(){
			    	$scope.spinny = false;
			    	console.log(deal.companyname+' signed their LOAS');
			    	$scope.authentication.user.notifications.push({note: deal.companyname+' signed their LOAS'});

			    	console.log('Ready to send Signed LOAs -- just type the damn code!');

			    });
	
	});


		// .success(function(data, status) {
		// 	console.log('Success!');
		// });

			// if(status === 200) {
			// 	//$scope.currentPrice = data.price;
			// 	console.log('Deal Updated - SUCCESS: ',data);
			// 	console.log('Data.Response: %o',data._id);
			// 		 $http({method: 'GET', url: '/pdf/'+dealId+'?name='+name, responseType: 'arraybuffer'}).
   //  					success(function(data, status, headers, config) {
    
   //   					var file = new Blob([data], {type: 'application/pdf'});
   //   					var fileURL = URL.createObjectURL(file);
   //   					window.open(fileURL);

			//     }).
			//     error(function(data, status, headers, config) {
			//       // called asynchronously if an error occurs
			//       // or server returns response with an error status.
			//       console.log('error');
			//     });
	



			// }	
			//});



			

		};

$scope.buildDTW = function(){
	console.log('got here %',$scope);
	console.log('Total Lines: ', $scope.deal);
	$scope.deal.$promise.then(function(){
		//$scope.deal.adl;
	var totlines = parseInt($scope.deal.adl)+1;
	console.log('Total Lines: %o', totlines);
	if(totlines<2){
		$scope.deal.lineDetails.push({});
	}else{
		for(var i = 0; i < totlines ; i++) {
		$scope.deal.lineDetails.push({});
	}

	}
		
});


};

$scope.myDealstages = [
{name: 'Pending Rep Review', value: '0', number: 0},
{name: 'LOAs Out for Signature', value: '5', number: 1},
{name: 'LOAs Signed', value: '15', number: 2},
{name: 'Pending Review', value: '20', number: 3},
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
	console.log('Date: ', date);
	//var converted = $scope.deal.converted;
//console.log('date' + date+ ' converted' + converted);
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
console.log('This : %o',this);

return $scope.deal.dslspeed;
};


		// Create new Deal
		$scope.testme = function(){
//window.alert(this.name);
	console.log('Testing %', $scope);
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
			console.log(deal);

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
			console.log(deal);
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

		//confirm Installation
		$scope.confirmInstall = function() {
			var deal = $scope.deal;
			deal.stage=$scope.myDealstages[6].name;
			deal.stagenum=$scope.myDealstages[6].value;
			deal.updated = Date.now();
			
		};

		//resubmit order after Rep Review
		$scope.resubmit = function() {
			var deal = $scope.deal;
			deal.stage=$scope.myDealstages[4].name;
			deal.stagenum=$scope.myDealstages[4].value;
			deal.updated = Date.now();

		};

		$scope.QCApproved = function() {
			var deal = $scope.deal;
			deal.stage=$scope.myDealstages[4].name;
			deal.stagenum=$scope.myDealstages[4].value;
			deal.updated = Date.now();

		};
		//ASSIGN Centurylink Orer Number and update DEAL
		$scope.assignOrderNumber = function() {
			var deal = $scope.deal;
			deal.updated = Date.now();
			deal.stage=$scope.myDealstages[5].name;
			deal.stagenum=$scope.myDealstages[5].value;


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

			console.log('Find USer Info for PM Name %o', Authentication.user);
			var deal = $scope.deal;
			deal.updated = Date.now();
			deal.stage=$scope.myDealstages[3].name;
			deal.stagenum=$scope.myDealstages[3].value;
			deal.projectmanager = Authentication.user.displayName;
			$scope.mystage = $scope.myDealstages[3];
			
			console.log('Dealcontroller Deal: %o',deal);
			

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
			$scope.pending=true;
			deal.updated = Date.now();
			
			$scope.step=5;
			var deal = $scope.deal;

			console.log('Look for deal.stage and deal.stagenum %o', $scope);
			if($scope.mystage){
			deal.stage=$scope.mystage.name;
			deal.stagenum=$scope.mystage.value;
			}else{
			deal.stage=$scope.myDealstages[1].name;
			deal.stagenum=$scope.myDealstages[1].value;
			}
			console.log('Dealcontroller Deal: %o',deal);
			deal.$update(function() {
				console.log('Updating Deal before sending Order Packet');
				//$location.path('deals/' + deal._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			}).then(function() {
				$scope.pending=false;

				$scope.sending=true;

				console.log('Line Numbers', deal.lineDetails[0].number);

				$http({
		method: 'post',
		url: 'http://adsoap.com/nodeEMAILPDF',
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
//console.log('Data Returned '+data);
			//$scope.currentPrice = data.price;
			//$scope.currentNRR = data.nrr;
			$scope.sending = false;
			$scope.finished = true;
			$scope.myresponse = data;



//Get Quote Details and Save to Lead Object


}


	})
.error(function(data){
	console.log('OOps...'+data);
});



			});
		};

		// Update existing Deal
			$scope.update = function() {
			var deal = $scope.deal ;
			deal.updated = Date.now();
			console.log('Look for deal.stage and deal.stagenum %o', $scope);
			if($scope.mystage){
			deal.stage=$scope.mystage.name;
			deal.stagenum=$scope.mystage.value;
			}
			console.log('Dealcontroller Deal: %o',deal);
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
			console.log('Deal Info: %o', $scope.deal);
			$scope.mystage = $scope.deal.stage;

			
		};
	}
]);