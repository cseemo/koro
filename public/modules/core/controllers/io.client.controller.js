
  'use strict';

  angular.module('core').controller('IoCtrl', ['Authentication', '$scope', 'socket', 
    function(Authentication, $scope, socket) {

		$scope.notifys=[];
		$scope.chadtest = 'It works bro';

		socket.on('test', function(data) {
	        ////console.log('Socket Data: %o', data);
	      
	        if(data.type==='convert'){
	          data.message1 = 'just converted';
	          data.message2 = 'from a lead to a deal!';
	          data.head = 'Deal Converted';
	          data.icon = 'check';
	        }
	        if(data.type==='submit'){
	          data.message1 = 'just sent ';
	          data.message2 = 'an order packet';
	          data.head = 'Order Packet Sent';
	          data.icon = 'share';
	        }
	        if(data.type==='quote'){
	          data.message1 = 'just sent';
	          data.message2 = 'a quote for $'+data.mrc+'. ('+data.dsl+' - '+data.lines+' additional lines)';
	          data.head = 'Proposal Sent';
	          data.icon = 'paper-plane';
	        }
	        if(data.type==='approve'){
	          data.message1 = 'just converted';
	          data.message2 = 'from a lead to a deal!';
	          data.head = 'Deal Converted';
	          data.icon = 'dollar';
	        }
	        if(data.type==='signin'){
	          data.message1 = 'signed in.';
			  // data.message2 = 'from a lead to a deal!';
	          data.head = 'Sign-In';
	          data.icon = 'user';
	        }
	        ////console.log(data.message);
	        $scope.notifys.push(data);
	        ////console.log('Other Event %o', data);

	        // $timeout(function(){
	        //   toastr.info(data.message);
	        // }, 1000);
	        // $scope.myObject = data;
	        // toastr.info('New User Connected ...'+data.count+' current users.');
        });
    }]);