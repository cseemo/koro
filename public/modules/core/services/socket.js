'use strict';

// angular.module('core').factory('Socket', ['socketFactory',
// 	function(socketFactory) {
// 		return socketFactory({
// 			prefix: '',
// 			ioSocket: io.connect('http://localhost:5000')
// 		});
// 	}
// 	]);

angular.module('core')
.factory('socket', function ($rootScope) {
	console.log('socket factory');
var socket = io.connect();
return {
on: function (eventName, callback) {
		console.log('looks like some shit was on');
socket.on(eventName, function () { 
var args = arguments;
$rootScope.$apply(function () {
callback.apply(socket, args);
});
});
},
emit: function (eventName, data, callback) {
	console.log('looks like some shit was emitted');
socket.emit(eventName, data, function () {
var args = arguments;
$rootScope.$apply(function () {
if (callback) {
callback.apply(socket, args);
}
});
});
}
};
});