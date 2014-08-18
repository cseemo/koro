'use strict';

// Timecards controller
angular.module('timecards').controller('TimecardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Timecards',
	function($scope, $stateParams, $location, Authentication, Timecards ) {
		$scope.authentication = Authentication;
console.log('scope %o', $scope);

$scope.clockIn = function (){

	var timecard = $scope.timecard;
	
	//console.log('nicole %o',comms);
	var now = Date();
	//window.alert(lead.user.displayName);
	timecard.shiftDetails.push({time: now, type: 'Clock-In'});
timecard.$update(function(data){},
	 function(errorResponse) {
		$scope.error = errorResponse.data.message;
		});


window.alert('ClockIn')

};

$scope.clockOut = function (){

	var timecard = $scope.timecard;
	
	//console.log('nicole %o',comms);
	var now = Date();
	//window.alert(lead.user.displayName);
	timecard.shiftDetails.push({time: now, type: 'Clock-Out'});
timecard.$update(function(data){},
	 function(errorResponse) {
		$scope.error = errorResponse.data.message;
		});


window.alert('ClockOut')


};

		$scope.getByDay = function() {
			var timecard = Timecards.getDaily();
		}();

		// Create new Timecard
		$scope.create = function() {

			// Create new Timecard object
			var timecard = new Timecards ({
				name: this.name
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

		// Find existing Timecard
		$scope.findOne = function() {
			$scope.timecard = Timecards.get({ 
				timecardId: $stateParams.timecardId
			});
		};
	}
]);