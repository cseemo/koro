'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', '$location', '$cookieStore', '$http', '$filter', 'Tasks', 'socket', 
	function( $scope, Authentication, Menus, $location, $cookieStore, $http, $filter, Tasks, socket) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.user = Authentication.user;

		if (!$scope.authentication.user) {
			console.log('User Not Logged in');
          var test = $location.path();
          test = test.substring(0,15);
          console.log('Test Path',test);

			if(test==='/forgot_passwor' || test==='/reset_password' || test==='/signup'){
            console.log('Resetting Password');
          
          
          }else{
          	console.log('Please sign in');
          	$location.path('/signin');
		}
		}

		// Update Task Notifications

           socket.on(user._id, function(data) { 
               
                console.log('IO EVENT From Header MODAL .....!!!!!');
                  console.log('Our IO Data: ', data);
                  var prettyDate = $filter('date')(data.dueDate, 'short');
                  toastr.info('You have a new task assigned to you. The task is due by '+prettyDate);
                   var audio = new Audio('modules/core/sounds/ding.mp3');
          			audio.play();
                  $scope.getUserTasks();

                  });


           $scope.getUserTasks = function(){
			console.log('Getting user tasks...');
			Tasks.query({assignedTo: $scope.authentication.user._id, status: 'Due'}).$promise.then(function(tasks){
				console.log('We found '+tasks.length+' tasks...');
				$scope.tasks = tasks;
				console.log(tasks);
			})

		};

		$scope.viewTask = function(task){
			console.log('Opening modal to view this task...', task);
			var modalInstance;
     modalInstance = $modal.open({
         templateUrl: 'taskModal.html',
          controller: function($scope, $modalInstance, user, task, $timeout, $filter, socket){
           
            $scope.user = user;
            $scope.task = task;
            

            $scope.save = function(type){
              console.log('Updating Task...', type);
              if(type==='complete'){
              	console.log('This task is complete...');
              	task.complete = Date.now();
              	task.completionNotes = $scope.notes;
              	task.status = 'Pending Review';
              	task.$update(function(){
              		console.log("Done updtaeing the task...");
              		console.log(task);
              		$modalInstance.close();

              	})
              }else{
              	console.log('Order not complete...');
              	task.completionNotes = $scope.notes;
              	task.status = 'Pending Review';
              	task.$update(function(){
              		console.log("Done updtaeing the task...");
              		console.log(task);
              		$modalInstance.close();

              	})
              }

               

            };

            $scope.close = function(){
              console.log('Closing Modal');
              $modalInstance.dismiss('Closed');
            };
          },
          resolve: { 
            user: function() {
              return $scope.authentication.user
            }, 
            task: function() {
              return task
            },
            
             
          }
        });


        modalInstance.result.then(function(result) {
          console.log('Modal finished..', result);

          $scope.getUserTasks();

       
          
        }, function() {
        	
          console.log('Modal dismissed at: ' + new Date());
        });
  
		};



		// $scope.signin = function() {
		// 	$http.post('/auth/signin', $scope.credentials).success(function(response) {
		// 		//If successful we assign the response to the global user model
		// 		$scope.authentication.user = response;
		// 		socket.emit('message', {type: 'signing', user: $scope.authentication.user.displayName});
				
		// 		//And redirect to the index page
		// 		$location.path('/');
		// 	}).error(function(response) {
		// 		$scope.error = response.message;
		// 	});
		// };


		
		//if( ! Authentication.user ) $location.path('/signin');
		if( Authentication.user ) {
			//console.log('Logged In ');
			$scope.canSee=true;

			$scope.numNotifications = $scope.authentication.user.notifications.length;
		}

		if( ! Authentication.user ) {
			//console.log('not logged in');
			$scope.canSee=false;

		}


$scope.clockedIn = false;

//Need to write code to check Mongoose for open Timeclock
//Have cookies stored - need to deal w them also
$scope.clockedInVal = 'Clocked-Out';


$scope.clockIn= function(type) {
	//console.log('Got Here');
	$scope.clockedIn = true;
	
	var date = Date.now();
	var time = $filter('date')(new Date(date), 'h:mma');

	////console.log('timecard %o',$scope);
	$scope.clockedInVal = 'Clocked-In';
	switch(type){
		case 'break': 
			toastr.info('You have been clocked-in for break at '+time);
			$cookieStore.put('breakEnd', Date.now());
			break;

		case 'lunch': 
			toastr.info('You have been clocked-in for lunch at '+time);
			$cookieStore.put('lunchEnd', Date.now());
			break;

		case 'shift': 
			toastr.info('You have been clocked-in at '+time);
			$cookieStore.put('shiftStart', Date.now());
			break;
	}
			
	$http.get('/awesome/clock').success(function(data) {
	
	//console.log('Response %o',data);
	//window.alert('Response');
}).error(function(data) {

//console.log('Error: ' + data);
});

		};


		$scope.clockOut = function(type) {
			$scope.clockedIn = false;
			$scope.clockedInVal = 'Clocked-Out';
			var date = Date.now()
	var time = $filter('date')(new Date(date), 'h:mma');

			switch(type){
				case 'break': 
			toastr.info('You have been clocked-out for break at '+time);
			$cookieStore.put('breakStart', Date.now());
				$scope.clockedInVal = 'At Break';
			break;

			case 'lunch': 
			toastr.info('You have been clocked-out for lunch at '+time);
			$cookieStore.put('lunchStart', Date.now());
				$scope.clockedInVal = 'At Lunch';
			break;

			case 'shift': 
			toastr.info('You have been clocked-out at '+time);
			$cookieStore.put('shiftEnd', Date.now());
			break;
			}

				$http.get('/awesome/clock').success(function(data) {
	
	//console.log('Response %o',data);
	//window.alert('Response');
}).error(function(data) {

//console.log('Error: ' + data);
});

};
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);