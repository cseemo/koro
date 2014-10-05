'use strict';

// Timecards controller
angular.module('timecards').controller('TimecardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Timecards', '$http', '$filter', '$cookieStore',  
	function($scope, $stateParams, $location, Authentication, Timecards, $http, $filter, $cookieStore ) {
		$scope.authentication = Authentication;
console.log('scope %o', $scope);

// $scope.clockIn = function (){

// 	var timecard = $scope.timecard;
	
// 	//console.log('nicole %o',comms);
// 	var now = Date();
// 	//window.alert(lead.user.displayName);
// 	timecard.shiftDetails.push({time: now, type: 'Clock-In'});
// timecard.$update(function(data){},
// 	 function(errorResponse) {
// 		$scope.error = errorResponse.data.message;
// 		});




// window.alert('ClockIn')

// };


//Check cookies to see if User h

// $scope.checkCookie = function(){
// console.log('Got here');
// $scope.clockedIn = false;
// $scope.clockedInVal='Hosed';


// };
// $scope.clockedIn = $scope.checkCookie();
// $scope.clockedInVal = 'Clocked-Out';
// $scope.clockedIn.$promise.then(function(cb){


// });

// $scope.clockedIn = false;
// $scope.clockedInVal = 'Checking';


// $scope.clockIn= function(type) {
// 	console.log('Got Here');
// 	$scope.clockedIn = true;

// 	var date = Date.now();
// 	var time = $filter('date')(new Date(date), 'h:mma');

// 	//console.log('timecard %o',$scope);
// 		$scope.clockedInVal = 'Clocked-In';
// 			switch(type){
// 				case 'break': 
// 			toastr.info('You have been clocked-in for break at '+time);
// 			$cookieStore.put('breakEnd', Date.now());
			
// 			break;

// 			case 'lunch': 
// 			toastr.info('You have been clocked-in for lunch at '+time);
// 			$cookieStore.put('lunchEnd', Date.now());
// 			break;

// 			case 'shift': 
// 			toastr.info('You have been clocked-in at '+time);
// 			$cookieStore.put('shiftStart', Date.now());
// 			break;
// 			}
			
// 	$http.get('/awesome/clock').success(function(data) {
	
// 	console.log('Response %o',data);
// 	//window.alert('Response');
// }).error(function(data) {

// console.log('Error: ' + data);
// });

// 		};


// 		$scope.clockOut = function(type) {
// 			$scope.clockedIn = false;
// 			$scope.clockedInVal = 'Clocked-Out';
// 			var date = Date.now()
// 	var time = $filter('date')(new Date(date), 'h:mma');

// 			switch(type){
// 				case 'break': 
// 			toastr.info('You have been clocked-out for break at '+time);
// 			$cookieStore.put('breakStart', Date.now());
// 				$scope.clockedInVal = 'At Break';
// 			break;

// 			case 'lunch': 
// 			toastr.info('You have been clocked-out for lunch at '+time);
// 			$cookieStore.put('lunchStart', Date.now());
// 				$scope.clockedInVal = 'At Lunch';
// 			break;

// 			case 'shift': 
// 			toastr.info('You have been clocked-out at '+time);
// 			$cookieStore.put('shiftEnd', Date.now());
// 			break;
// 			}

// 				$http.get('/awesome/clock').success(function(data) {
	
// 	console.log('Response %o',data);
// 	//window.alert('Response');
// }).error(function(data) {

// console.log('Error: ' + data);
// });

// // $scope.clockOut = function (){

// // 	var timecard = $scope.timecard;
	
// // 	//console.log('nicole %o',comms);
// // 	var now = Date();
// // 	//window.alert(lead.user.displayName);
// // 	timecard.shiftDetails.push({time: now, type: 'Clock-Out'});
// // timecard.$update(function(data){},
// // 	 function(errorResponse) {
// // 		$scope.error = errorResponse.data.message;
// // 		});


// // window.alert('ClockOut')

// };
$scope.thisShift = '';
$scope.getShift = function(){
	//Need to check if User is clocked-in -- if NOT display nothing
	console.log('Are you clockedin? ',$scope.clockedIn);
	var start = $cookieStore.get('shiftStart');
	console.log('Shift Started at ', start);
	var now = Date.now();
	var time = now-start;
	var minutes = (time/1000)/60;
	var shiftinfo = Math.round(minutes);
	var hours = minutes/60;

	//If it's less than a minute
	if($scope.clockedIn===false){
		$scope.thisShift = 'You are clocked out';
	}else{


	$scope.thisShift = 'You clocked in '+$filter('timeago')(start);

	}
	// var shiftdata = $filter('date')(time, 'hh:mm');

	// $scope.thisShift = shiftdata;



};


$scope.myminutes = '0:00';
		$scope.getByDay = function() {
				var difference;
		var seconds;
		var minutes;
			// $scope.myminutes = Timecards.getDaily();
			$http.get('/timecards/byday').success(function(data) {
	
	$scope.timecards = data.data;

	console.log('Response %o',data);
	// window.alert('Response');
	console.log('length',data.length);
		$scope.secondsworked = data[0].total;
		var minutesworked = 0;

// 		if(data.length>0){
// 			Object.keys(data).forEach(function(key){
// 				var val = data[key];

// 		console.log('My Value; ',val);


// 		difference = val.end-val.start;
// 		console.log('Difference, ',difference);
// 		seconds = difference/1000;
// 		minutes = seconds/60;
// 		console.log('Seconds logged in',seconds);
// 		console.log('Timecards, ',difference);
// 		console.log('Minutes: , ',minutes);
// 		console.log('minutes worked ',minutesworked);
// 		minutesworked = minutesworked+minutes;
// 		console.log('minutesworked2',minutesworked);

// });

// 			$scope.myminutes = minutesworked;
// 		}

}).error(function(data) {

console.log('Error: ' + data);
});
				console.log('Done');
			

			
			
		};

		// Create new Timecard
		$scope.create = function() {

			// Create new Timecard object
			var timecard = new Timecards ({
				name: $scope.authentication.user.displayName
			});

			// Redirect after save
			timecard.$save(function(response) {
				$location.path('timecards/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Timecard
		$scope.remove = function( timecard ) {
			if ( timecard ) { timecard.$remove();

				for (var i in $scope.timecards ) {
					if ($scope.timecards [i] === timecard ) {
						$scope.timecards.splice(i, 1);
					}
				}
			} else {
				$scope.timecard.$remove(function() {
					$location.path('timecards');
				});
			}
		};

		// Update existing Timecard
		$scope.update = function() {
			var timecard = $scope.timecard ;

			timecard.$update(function() {
				$location.path('timecards/' + timecard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Timecards
		$scope.find = function() {
			$scope.timecards = Timecards.query();
		};

		$scope.getHours = function(){
			
				$http.get('/awesome/hours').success(function(data) {
	
	console.log('Hours Response %o',data);
	$scope.mydata = data;
	
}).error(function(data) {

console.log('Error: ' + data);
});

		};


		



		// Find existing Timecard
		$scope.findOne = function() {
			$scope.timecard = Timecards.get({ 
				timecardId: $stateParams.timecardId
			});
		};
	}
]).filter('timeago', function () {
    //time: the time
    //local: compared to what time? default: now
    //raw: wheter you want in a format of "5 minutes ago', or '5 minutes'
    return function (time, local, raw) {
    	console.log('Time',time);
    	console.log('Local',local);
    	console.log('Raw',raw);
        if (!time) return 'never';
 
        if (!local) {
            (local = Date.now())
        }
 
        if (angular.isDate(time)) {
            time = time.getTime();
        } else if (typeof time === 'string') {
            time = new Date(time).getTime();
        }
 
        if (angular.isDate(local)) {
            local = local.getTime();
        }else if (typeof local === 'string') {
            local = new Date(local).getTime();
        }
 
        if (typeof time !== 'number' || typeof local !== 'number') {
            return;
        }
 
        var
            offset = Math.abs((local - time) / 1000),
            span = [],
            MINUTE = 60,
            HOUR = 3600,
            DAY = 86400,
            WEEK = 604800,
            MONTH = 2629744,
            YEAR = 31556926,
            DECADE = 315569260;
 
        if (offset <= MINUTE)              span = [ '', raw ? 'now' : 'less than a minute' ];
        else if (offset < (MINUTE * 60))   span = [ Math.round(Math.abs(offset / MINUTE)), 'min' ];
        else if (offset < (HOUR * 24))     span = [ Math.round(Math.abs(offset / HOUR)), 'hr' ];
        else if (offset < (DAY * 7))       span = [ Math.round(Math.abs(offset / DAY)), 'day' ];
        else if (offset < (WEEK * 52))     span = [ Math.round(Math.abs(offset / WEEK)), 'week' ];
        else if (offset < (YEAR * 10))     span = [ Math.round(Math.abs(offset / YEAR)), 'year' ];
        else if (offset < (DECADE * 100))  span = [ Math.round(Math.abs(offset / DECADE)), 'decade' ];
        else                               span = [ '', 'a long time' ];
 
        span[1] += (span[0] === 0 || span[0] > 1) ? 's' : '';
        span = span.join(' ');
 
        if (raw === true) {
            return span;
        }
        return (time <= local) ? span + ' ago' : 'in ' + span;
    }
});