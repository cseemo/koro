'use strict';

// angular.module('core').factory('Socket', ['socketFactory',
//    function(socketFactory) {
//       return socketFactory({
//          prefix: '',
//          ioSocket: io.connect('http://localhost:5000')
//       });
//    }
//    ]);

angular.module('core').factory('socket', function($rootScope) {
    console.log('Got to the socket factory', Date.now());
    var socket = io.connect();
    return {
        on: function(eventName, callback) {
            //console.log('looks like some shit was on');
            socket.on(eventName, function() {
                var args = arguments;

                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, data, callback) {
            //console.log('looks like some shit was emitted');
            socket.emit(eventName, data, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}).factory('notfication_test', ['socket', 'Authentication', function(socket, Authentication, $rootScope) {

   // Display our message via toastr
   var display_message = function(data) {
      console.log('Socket Data for specific user : %o', Authentication.user);
      toastr.info(data.deal+' just signed their LOAs!!');     
   }
   
   //If a socket call comes for this user Fire off a toastr event
   socket.on(Authentication.user._id, display_message);
   
      // Return a reusable object that allows us to call the display_message function via notification_test.notify({ // data });
      return {
         notify: display_message,
      };
}]);

// socket.on('test', function(data) {
//      //console.log('Socket Data: %o', data);

//      $scope.myObject = data;
//      toastr.info(data.message);
//      $scope.notifys.push(data);
//      //console.log('Other Event %o', data);
//      // $scope.myObject = data;
//      // toastr.info('New User Connected ...'+data.count+' current users.');
//      });