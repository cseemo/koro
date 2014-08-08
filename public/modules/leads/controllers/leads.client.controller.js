'use strict';


// Leads controller
angular.module('leads').controller('LeadsController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Leads',
	function($http, $scope, $stateParams, $location, Authentication, Leads ) {
		$scope.authentication = Authentication;

		if( ! Authentication.user ) $location.path('/signin');


$scope.currentPrice = 85;
$scope.currentNRR = 0;
$scope.adl = 0;
//$log.info(speeds);

//FORM DATA CONTROL TEST
$scope.datas = [];
$scope.orig = angular.copy($scope.datas);

$scope.coInfo = 'false';

$scope.coInfon = function(){
	if($scope.coInfo){
		$scope.coInfon = 'Hide Company Info';
	}else{
		$scope.coInfon = 'Show Company Info';
	}
};



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
$scope.dslspeed = $scope.mySpeeds[10];
$scope.myterm = $scope.myTerms[2];
$scope.nrc = $scope.myNRC[1];
$scope.mycredits = $scope.myCredits[0];
$scope.myip= $scope.myIP[0];
$scope.loa= $scope.myLOA[0];





		// Create new Lead
		$scope.create = function() {
			// Create new Lead object

			var lead = new Leads ({
				companyname: this.companyname,
				contactname: this.contactname,
				telephone: this.telephone,
				address: this.address,
			});

			console.log(lead);

			// Redirect after save
			lead.$save(function(response) {
				$location.path('leads/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

			// Get Next Lead Lead
		$scope.nextLead = function() {


	var lead = $scope.lead ;
	var comms = this.myForm.comments.$modelValue;
	console.log('nicole %o',comms);
var now = Date();
lead.callDetails.push({comments: comms, calltime: now});

			lead.$update(function(data) {
				console.log('dialLead',data);
				//$location.path('leads/' + lead._id + '/dialing');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
		});



						$http({
		method: 'get',
		url: '/getnewlead',
	})
.success(function(data, status) {
		if(status === 200) {
			//$scope.currentPrice = data.price;
console.log('Data: ',data);
console.log('Data.Response: %o',data[0]._id);
	
	$location.path('leads/' + data[0]._id);
		}
	});
		


		};

			$scope.updateEmail = function() {

			var lead = $scope.lead ;
lead.email = this.myForm.email.$viewValue;
//window.alert(lead.email);
			lead.$dial(function() {
				$location.path('leads/' + lead._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

$scope.dialLead = function() {
	var lead = $scope.lead;

	  lead.lastCalled = Date();
			lead.$update(function(data) {
				console.log('dialLead',data);
				//$location.path('leads/' + lead._id + '/dialing');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
		});  

window.alert('Calling');
};



$scope.makeQuote = function(){
	console.log('Test');
	console.log(this.myForm);

this.term = this.myForm.term.$viewValue;
this.dsl = this.myForm.dsl_speed.$viewValue;
this.adl = this.myForm.adl.$viewValue;
this.modem = this.myForm.modem.$viewValue;
this.nrcs = this.myForm.nrcs.$viewValue;
this.credits = this.myForm.credits.$viewValue;
this.iptype = this.myForm.staticIP.$viewValue;
console.log('coname: %o'+this.myForm);
console.log('dmname: '+this.dmname);

this.coname = this.myForm.companyname.$viewValue;

this.dmname = this.myForm.dmname.$viewValue;
this.tel = this.myForm.telephone.$viewValue;
this.email = this.myForm.email.$viewValue;
this.sendloas = this.myForm.sendloas.$viewValue;
console.log('coname: '+this.coname);
console.log('dmname: '+this.dmname);


 
			$http({
		method: 'post',
		url: 'http://adsoap.com/nodeEMAILPDF',
		data: {
			term: this.term,
			dslspeed: this.dsl.svalue,
			adllines: this.adl,
			full_name: this.dmname,
			phone: this.tel,
			email: this.email, 
			companyname: this.coname, 
			modem: this.modem.value,
			nrc: this.nrcs.value,
			credits: this.credits.name,
			staticIP: this.iptype.name,
			sendloas: this.sendloas.value
		},
		headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
	})
.success(function(data, status) {
		if(status === 200) {
			//$scope.currentPrice = data.price;
console.log('Data Returned '+data);
			//$scope.currentPrice = data.price;
			//$scope.currentNRR = data.nrr;
			window.alert(data);
		}
	})
.error(function(data){
	console.log('OOps...'+data);
});

	

};


		// Remove existing Lead
		$scope.remove = function( lead ) {
			if ( lead ) { lead.$remove();

				for (var i in $scope.leads ) {
					if ($scope.leads [i] === lead ) {
						$scope.leads.splice(i, 1);
					}
				}
			} else {
				$scope.lead.$remove(function() {
					$location.path('leads');
				});
			}
		};

		// Update existing Lead
		$scope.update = function() {
			var lead = $scope.lead ;

			lead.$update(function() {
				$location.path('leads/' + lead._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// Find a list of Leads
		$scope.find = function() {
			$scope.leads = Leads.query();

		};

		// Find existing Lead
		$scope.findOne = function() {
			$scope.lead = Leads.get({ 
				leadId: $stateParams.leadId
			});
			//$scope.callDetails = $scope.lead.callDetails;
			console.log('callDetails %o',$scope.lead);
		};





$scope.getQuote = function() {
	

console.log('Form',this.myForm);

this.term = this.myForm.term;
this.dsl = this.myForm.dsl_speed;
this.adl = this.myForm.adl;
this.modem = this.myForm.modem;
this.nrcs = this.myForm.nrcs;
this.credits = this.myForm.credits;
this.iptype = this.myForm.staticIP;



			$http({
		method: 'post',
		url: '/quote',
		data: {
			term: this.term.$viewValue,
			adl: this.adl.$viewValue,
			dsl: this.myForm.dsl_speed.$viewValue,
			modem: this.modem.$viewValue,
			nrcs: this.nrcs.$viewValue,
			credits: this.credits.$viewValue,
			iptype: this.iptype.$viewValue
		}
	})
.success(function(data, status) {
		if(status === 200) {
			//$scope.currentPrice = data.price;
console.log(data);
			$scope.currentPrice = data.price;
			$scope.currentNRR = data.nrr;
		}
	});

};




	}]);
