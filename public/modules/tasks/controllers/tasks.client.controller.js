'use strict';

// Tasks controller
angular.module('tasks').controller('TasksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tasks', 'Users', '$modal', 'socket', '$filter', '$http',   
	function($scope, $stateParams, $location, Authentication, Tasks, Users, $modal, socket, $filter, $http) {
		$scope.authentication = Authentication;


		 //Table Stuff

  $scope.tableData = {
      searchKeywords: '',
    };
    $scope.filteredTasks= [];
    $scope.row = '';
    $scope.numPerPageOpt = [10, 20, 50, 100, 250, 500];
    $scope.numPerPage = $scope.numPerPageOpt[0];
    $scope.currentPage = 1;
    //$scope.currentPageDeals= $scope.getinit;
    $scope.currentPageTasks= [];



    $scope.select = function(page) {
       
      var end, start;
      start = (page - 1) * $scope.numPerPage;
      end = start + $scope.numPerPage;
    
      $scope.currentPage = page;
      $scope.currentPageTasks = $scope.filteredTasks.slice(start, end);
      
    
    return $scope.currentPageTasks;


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
      
      $scope.filteredTasks = $filter('filter')($scope.Tasks, $scope.tableData.searchKeywords);

      return $scope.onFilterChange();
    };

     $scope.searchPending = function() {
      ////////////////console.log('Keywords: ', $scope.tableData.searchKeywords);
      $scope.filteredTasks = $filter('filter')($scope.Tasks, $scope.tableData.searchKeywords);

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
      ////////////////console.log('Scope.row ', $scope.row);
      if ($scope.row === rowName) {
        return;
      }
      $scope.row = rowName;
      $scope.filteredTasks = $filter('orderBy')($scope.filteredTasks, rowName);
      ////////////////console.log(rowName);
      return $scope.onOrderChange();
    };

    // $scope.setCurrentOffender = function(ind) {
    //   $scope.currentDevice = $scope.filteredTasks.indexOf(ind);
    // };

    $scope.init = function() {
      console.log('Getting Tasks');
 
       $http({
          method: 'get',
          url: '/allOfOurTasks',
          })
          .success(function(data, status) {
            console.log('Got all of the Tasks WITH the shop data and client name!!!');
            console.log(data);
         $scope.Tasks = data;
          $scope.filteredTasks = data;
         return $scope.select($scope.currentPage);
      }).error(function(err){
        console.log(err);

      });
      
  

    };


    //Alert Rep that their task was rejected
    var alertRepOfRejection = function(task){
      console.log('Alerting the rejection...');
       $http.post('/rejectTask', task).success(function(response) {
        console.log('Completed our notification...', response);

     }).error(function(response) {
       $scope.error = response.message;
     });

    };
    //Admin View of Task
    $scope.adminTaskView = function(task){
      console.log('Opening modal to view this task...', task);
      var modalInstance;
     modalInstance = $modal.open({
         templateUrl: 'adminTaskModal.html',
          controller: function($scope, $modalInstance, user, task, $timeout, $filter, socket, Users){
           
            $scope.user = user;
            $scope.task = task;
            
            $scope.assignTask = function(task){
              console.log('Assigning Task NOw');
              $scope.showUsers = true;
              $scope.users = Users.query();

            };

            $scope.updateAssignTo = function(task, row, huh){
              console.log('Assinging task ', task);
              console.log(huh);
              console.log('User ', row);
              
              $scope.showSave = true;
              task.assignedBy = user._id,
              
             console.log(task);
            };


            $scope.save = function(type){
              console.log('Updating Task...', type);
              console.log(task);

              if($scope.notes){
                task.managerNotes = $scope.notes;
              }
              task.lastUpdate = Date.now();

              if(type===true){
                //Task has been approved
                console.log('Notes: ', $scope.notes);
                task.approved = Date.now();
                task.rejected = null;
                task.status = 'Complete';
                task.completed = Date.now();
              }
              if(type===false){
                //task has been denied
                console.log('Notes: ', $scope.notes);
                task.rejected = Date.now();
                task.timesRejected = parseInt(task.timesRejected)+1;
                task.status = 'Due';
              }
              if(type==='Updated'){
                console.log('Notes: ', $scope.notes);
                task.assignedBy = $scope.user._id;
                task.assignedTo = $scope.searchForUser._id;
                task.status = 'Due';
                console.log(task);
              }
              $modalInstance.close(task);

              // if(type==='complete'){
              //   console.log('This task is complete...');
              //   task.complete = Date.now();
              //   task.completionNotes = $scope.notes;
              //   task.status = 'Pending Review';
              //   task.$update(function(){
              //     console.log("Done updtaeing the task...");
              //     console.log(task);
              //     $modalInstance.close();

              //   })
              // }else{
              //   console.log('Order not complete...');
              //   task.completionNotes = $scope.notes;
              //   task.status = 'Pending Review';
              //   task.$update(function(){
              //     console.log("Done updtaeing the task...");
              //     console.log(task);
              //     $modalInstance.close();

              //   })
              // }

               

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


          Tasks.get({taskId: result._id}).$promise.then(function(ourTask){
            console.log("Got our task....", ourTask);

            ourTask.completed = result.completed,
            ourTask.lastUpdate = result.lastUpdate,
            ourTask.rejected = result.rejected,
            ourTask.managerNotes = result.managerNotes,
            ourTask.status = result.status,
            ourTask.approved = result.approved,
            ourTask.assignedBy = result.assignedBy,
            ourTask.assignedTo = result.assignedTo,
            ourTask.timesRejected = result.timesRejected,
            ourTask.$update(function(){
              console.log('Updated our task...');
              console.log('Alert rep if the task was rejected...');
              if(result.rejected){
                console.log('This bitch WAS REJECTED!!!!');
                alertRepOfRejection(result);
              }
              $scope.init();
            })

          });

       
          
        }, function() {
          
          console.log('Modal dismissed at: ' + new Date());
        });

    };



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
                task.lastUpdate = Date.now();
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