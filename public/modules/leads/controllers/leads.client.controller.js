'use strict';


// Leads controller
angular.module('leads').controller('LeadsController', ['$http', '$scope', '$stateParams', '$location', 'Authentication', 'Leads', 'Deals', '$timeout',
	function($http, $scope, $stateParams, $location, Authentication, Leads, Deals, $timeout) {
		$scope.authentication = Authentication;
		$scope.sending = false;
		$scope.emailbuttons = true;
		$scope.results = false;
		if( ! Authentication.user ) $location.path('/signin');

		$scope.convertToDeal = function(){
			//console.log('Scope: %o',$scope);
			console.log('This %o', this);

			var dslspeed = this.dslspeed.value,
			 	lead = $scope.lead;
				lead.status = 'Closed/Won';
				var term = this.myterm.name;
				var 	adl = 		this.myadl;
				var 	modem =	this.mymodem.value;
				var 	waivenrcs =	this.nrc.value;
				var 	winbackcredits =	this.mycredits.value;
				var 	staticip =	this.myip.value;
				var 	converted = 	Date.now();
				var mrc = this.currentPrice;
				var nrc = this.currentNRR;
			
			console.log('DSL Speed: ', dslspeed);
			console.log('Lead User %o', lead.user);
			
			lead.$update(function(response) {
				console.log('Lead Info To Populate %o',lead);
				
			
				var deal = new Deals ({
					companyname:	lead.companyname,
					contactemail:	lead.email,
					contactname:	lead.contactname,
					telephone:		lead.telephone,
					address:		lead.address,
					city:			lead.city,
					state:			lead.state,
					zipcode:		lead.zipcode,
					lastCalled:		lead.lastCalled,
					assigned:		lead.assigned,
					campaign:		lead.campaign,
					FLUPDate:		lead.FLUPDate,
					speed:			lead.speed,
					currentCarrier: lead.currentCarrier,
					created:		lead.created,
					assignedRep:	lead.assignedRep,
					term:			term,
					dslspeed:		dslspeed,
					adl:			adl,
					modem:			modem,
					waivenrcs:		waivenrcs,
					winbackcredits:	winbackcredits,
					staticip:		staticip,
					converted:		converted,
					updated: 		converted,
					mrc: 			mrc,
					nrc:            nrc
				});

				// Redirect after save
				deal.$save(function(response) {
					$location.path('convertingdeals/' + response._id);
					//console.log('New Deal %o', deal);
					
					// Clear form fields
					$scope.name = '';
			
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
			
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};



$scope.currentPrice = 85;
$scope.currentNRR = 0;
$scope.myadl = 0;
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


$scope.leadstatus = function(){
	$scope.leadstatus = $scope.lead.status;
	return $scope.leadstatus;
};

$scope.checkIt = function(){
window.alert('checking it');
$scope.lead.address.editMode = true;
$scope.leadstatus = $scope.lead.status;
return $scope.leadstatus;
};


$scope.statuses = ['Lead','Call-Back','Follow-Up', 'Proposed', 'Closed/Won', 'Closed/Lost'];



$scope.dispositions = ['No Answer','Not Available', 'Follow-Up', 'Proposed', 'Closed/Won', 'Not Interested', 'Disconnected', 'Wrong Number', 'Do Not Call List'];

$scope.positions = ['Receptionist','Owner','Other'];

$scope.gatepos = $scope.positions[0];
$scope.contpos = $scope.positions[1];

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

$scope.defaultSpeeds = [
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

		// Save Lead
			$scope.saveLead = function() {
				//console.log('Follow-Up %o',$scope.dt);
				//console.log('Time %o',$scope.mytime);
				var date = $scope.dt;
				var time = $scope.mytime;
				var datetime = new Date(date.getFullYear(), 
					date.getMonth(), 
					date.getDate(), 
					time.getHours(), 
					time.getMinutes(), 
					time.getSeconds());
				console.log('Follow-Up: ', datetime);
				// window.alert(datetime);


				//console.log('This %o',this.$$childHead);
				var lead = $scope.lead;
				
				var rep = lead.assignedRep;
				var comms = this.myForm.comments.$modelValue;
				var dispo = $scope.disposition;
				var who = $scope.callDetailscontact;
				lead.status = dispo;
				if(dispo=='Follow-Up'){
						//window.alert("Follow-Up set for :" + lead.FLUPDate);
						lead.FLUPDate = datetime;
					}
				console.log('saveLead Scope: %o',$scope);
				//console.log('nicole %o',comms);
				var now = Date();
				// window.alert(lead.user.displayName);
					lead.callDetails.push({comments: comms, calltime: now, rep: rep, who: who, disposition: dispo});
					lead.$update(function(data){},
					 function(errorResponse) {
						$scope.error = errorResponse.data.message;
						});

				
			};


//Get Follow-Ups for Table
$scope.FLUPS = function() {

$http.get('/flups').success(function(data) {
	$scope.myleads = data;
	//console.log('Response %o',data);
	// window.alert('Response');
}).error(function(data) {

console.log('Error: ' + data);
});


};

//Get Deals for Table Below

$scope.DEALS = function() {
	console.log('WTF');

$http.get('/getDeals').success(function(data) {
	$scope.mydeals = data;
	console.log('Deal Response %o', data.responseData);
	// window.alert('Response');
}).error(function(data) {

console.log('Error: ' + data);
});


};

			// Get Next Lead Lead
		$scope.nextLead = function() {
	var lead = $scope.lead;
	var rep = lead.assignedRep;
	var comms = this.myForm.comments.$modelValue;
	var dispo = $scope.disposition;
	var who = $scope.callDetailscontact;
	var date = $scope.dt;
	var time = $scope.mytime;
	var datetime = new Date(date.getFullYear(), 
					date.getMonth(), 
					date.getDate(), 
					time.getHours(), 
					time.getMinutes(), 
					time.getSeconds());
	lead.FLUPDate = datetime;
	//console.log('nicole %o',comms);
	lead.status = dispo;
	var now = Date();
	// window.alert(lead.user.displayName);
	lead.callDetails.push({comments: comms, calltime: now, rep: rep, who: who, disposition: dispo});
	lead.$update(function(data) {
	console.log('dialLead',data);
				//$location.path('/getnewlead');
						$http({
		method: 'get',
		url: '/getnewlead',
	})
.success(function(data, status) {
		if(status === 200) {
			//$scope.currentPrice = data.price;
console.log('Data: ',data);
console.log('Data.Response: %o',data._id);
	
	$location.path('leads/' + data._id);
		}
	});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
		});




		


		};


			$scope.updateEmail = function() {

			var lead = $scope.lead ;
lead.email = this.myForm.email.$viewValue;

		};


$scope.dialLead = function() {
	console.log('http--: %o',Authentication);
	var lead = $scope.lead;


	  lead.lastCalled = Date();
	  $scope.leadstatus = $scope.lead.status;
		return $scope.leadstatus;
		
//window.open('http://admin:67028@192.168.0.114/servlet?number=' + lead.telephone + '&outgoing_uri=sip-67028.accounts.vocalos.com', 'Dialing', 'toolbar=no, scrollbars=no, resizable=no, top=800, left=10, width=100, height=10');	

// window.alert('IP Phone Dialing '+lead.companyname+' at: '+lead.telephone);
};



$scope.makeQuote = function(){
	$scope.emailbuttons = false;
	$scope.sending = true;
	// window.alert("MakingQuote");
	//console.log('Test');
	console.log('Myform: %o', this.myForm);
var lead = $scope.lead;
	console.log('Lead Info %o', lead);

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
//this.sendloas = this.myForm.sendloas.$viewValue;
console.log('coname: '+this.coname);
console.log('dmname: '+this.dmname);

			lead.term =this.term.value;
			lead.dslspeed =this.dsl.svalue;
			lead.adl =this.adl;
			lead.modem =this.modem.value;
			lead.waivenrcs =this.nrcs.value;
			lead.winbackcredits = this.credits.name;
			lead.staticip =this.iptype.name;
			// lead.address =this.address.value;
			// lead.city =this.city.value;
			// lead.state =this.state.value;
			// lead.zipcode =this.zipcode.value;
			

			lead.$update(function() {
				$location.path('leads/' + lead._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			var myleadT = lead._id;

 
			$http({
		method: 'post',
		url: 'http://adsoap.com/nodeEMAILPDF',
		data: {
			mylead: myleadT,
			term: this.term.value,
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
			sendloas: 0,
			address: lead.address,
			city: lead.city,
			state: lead.state,
			zip: lead.zipcode
		},
		headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
			})
		.success(function(data, status) {
		$scope.sending = false;
		$scope.results = true;
		$scope.myresults = data;
		if(status === 200) {
			//$scope.currentPrice = data.price;
//console.log('Data Returned '+data);
			//$scope.currentPrice = data.price;
			//$scope.currentNRR = data.nrr;
			//window.alert(data);

			console.log('Got a 200 result sending the email');
//Get Quote Details and Save to Lead Object
			//window.alert(data);

			}
			$timeout(function(){
			$scope.emailbuttons = true;
			$scope.results = false;
					console.log('buttons back');

			}, 2500);
					


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
		$scope.updateLead = function() {
			console.log('Got here');
			var lead = $scope.lead ;

			lead.$update(function() {
				$location.path('leads/' + lead._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//Test
		$scope.chad = function(){

			window.alert("tetst");
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
			//console.log('callDetails %o',$scope.lead);
		};

	// Find existing Deal
		$scope.findOneDeal = function() {
			$scope.deal = Deals.get({ 
				dealId: $stateParams.dealId
			});


			//$scope.callDetails = $scope.lead.callDetails;
			console.log('Deal - Look for CallDetails %o',$scope.deal);
		};


		//get Call Details



		$scope.qwestLoop = function(address_id) {
			$scope.qwestCheckingServiceA = false;
			$scope.qwestCheckingService = true;
			if(address_id) {
				console.log('addressid: ', address_id);

				$http.get('/qwest/check/' + address_id)
					.success(function(data, status, headers, config) {
						//console.log('status: ', status);
						//console.log('response: ', data);
						console.log('speedData: ', data);
						//$scope.results = data.speeds;
						//$scope.availableSpeeds = data.speeds;
						$scope.qwestCheckingService = false;
						if(data.speeds.length) {
							$scope.mySpeeds = data.speeds;
							$scope.qwestValidService = true;
							$scope.dslspeed = $scope.mySpeeds[0];
						} else {
							$scope.mySpeeds = $scope.defaultSpeeds;
							$scope.qwestValidService = false;
							// Remove this shit
							$scope.dslspeed = $scope.mySpeeds[10];
						}
						//$scope.states = data.responseData.addresses;
					})
					.error(function(data, status, headers, config) {

					});
			}
		};

		$scope.addressSearch = function() {
			$scope.qwestCheckingServiceA = true;
			var addy = encodeURIComponent(
				$scope.lead.address + ',' + $scope.lead.city + ',' + $scope.lead.state
			);
			$http.jsonp('http://geoamsrv.centurylink.com/geoam/addressmatch/addresses?callback=JSON_CALLBACK&q='+addy+'&_=1409090948562')
			.success(function(data, status, headers, config) {
				//console.log('status: ', status);
				console.log('response: ', data);
				console.log('responseData: ', data.responseData.addresses)
				$scope.addresses = data.responseData.addresses;

				// New for chard!
				if($scope.addresses && $scope.addresses[0] && $scope.addresses[0].id)
				$scope.qwestLoop($scope.addresses[0].id);
			})
			.error(function(data, status, headers, config) {

			});

		};

		setTimeout(function() {
			$scope.lead.$promise.then(function() {
				$scope.addressSearch();
				console.log('search complete');
				
			});	
		}, 500);

		


$scope.getQuote = function() {
	

console.log('Form',this.myForm);

this.term = this.myForm.term;
this.dsl = this.myForm.dsl_speed;
this.adl = this.myForm.adl;
this.modem = this.myForm.modem;
this.nrcs = this.myForm.nrcs;
this.credits = this.myForm.credits;
this.iptype = this.myForm.staticIP;
console.log('Scope',$scope);


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
        'starting-day': 1
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
        return console.log('Time changed to: ' + $scope.mytime);
      };
      return $scope.clear = function() {
        return $scope.mytime = null;
};




	}]);



angular.module('leads').filter('datetime', function($filter)
{
return function(input){
	if(input === null){return ""; }

	var _date = $filter('date')(new Date(input),
		'EEE MMM d @ hh:mm a');

	return _date;
};
});



