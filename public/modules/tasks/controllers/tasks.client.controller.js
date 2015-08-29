'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks', 'Users', '$modal', 'socket', '$filter',   
	function($scope, $stateParams, $location, Authentication, Tasks, Users, $modal, socket, $filter) {
		$scope.authentication = Authentication;


		//Update Task Notifications

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
		// Create new Task
		$scope.create = function() {
			// Create new Task object
				var date = new Date($scope.dt);
				var time = $scope.mytime;
				////console.log('Do we have a '+date+'?? What about some time: '+time);
				var datetime = new Date(date.getFullYear(), 
					date.getMonth(), 
					date.getDate(), 
					time.getHours(), 
					time.getMinutes(), 
					time.getSeconds());
				////console.log('Appt Date Time: ', datetime);
				datetime.toUTCString();
				console.log('Due Date: ', datetime);
			console.log($scope);
			var repeatCycle = null, repeatDueBy = null;

			var task = new Tasks ({
				name: $scope.name,
				details: $scope.details,
				assignedTo: $scope.assignTo._id,
				assignedBy: $scope.authentication.user._id,
				repeat: $scope.repeatTask,
				repeatDueBy: repeatDueBy,
				repeatCycle: repeatCycle,
				dueDate: datetime,
				status: 'Due'
			});

			// Redirect after save
			task.$save(function(response) {
				console.log(response);
				$location.path('tasks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.repeatOptions = ['Never', 'Hourly', 'Daily', 'Weekly', 'Monhtly'];


 $scope.today = function() {
        return $scope.dt = new Date();
      };
      $scope.today();
      $scope.showWeeks = true;
      $scope.toggleWeeks = function() {
        return $scope.showWeeks = !$scope.showWeeks;
      };
      $scope.clear = function() {
        return $scope.offender.deployedDate = null;
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

      $scope.openCalendar = function($event, cal) {
        console.log('Calendar to Open: ', cal);
        $scope.opened = true;
        $event.preventDefault();
        $event.stopPropagation();
       
        
        
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

      $scope.changed = function() {
        return //////////////console.log('Time changed to: ' + $scope.mytime);
      };

    

		//Get Users
		$scope.getUsers = function(){
			console.log('Got users...');
			$scope.users = Users.query();

		};
		// Remove existing Task
		$scope.remove = function(task) {
			if ( task ) { 
				task.$remove();

				for (var i in $scope.tasks) {
					if ($scope.tasks [i] === task) {
						$scope.tasks.splice(i, 1);
					}
				}
			} else {
				$scope.task.$remove(function() {
					$location.path('tasks');
				});
			}
		};

		// Update existing Task
		$scope.update = function() {
			var task = $scope.task;

			task.$update(function() {
				$location.path('tasks/' + task._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tasks
		$scope.find = function() {
			$scope.tasks = Tasks.query();
		};

		// Find existing Task
		$scope.findOne = function() {
			$scope.task = Tasks.get({ 
				taskId: $stateParams.taskId
			});
		};
	}
]);