
'use strict';

module.exports = function(io){
	
	

		io.on('connection', function(socket){
		console.log('IO EVENT: Connect', socket);
		//console.log('Req??', req);
		var clients = io.eio.clientsCount;
		io.emit('test',  {message: 'Hooray! Someone new connected '+clients+' now connected.', count: clients});	


			socket.on('disconnect', function(){
			console.log('IO EVENT: Disconnect');
			var clients = io.eio.clientsCount;
			io.emit('test',  {message: 'User Disconnected...'+clients+' connected.', count: clients});	

	});

		socket.on('leave', function(){
		console.log('IO EVENT: Leave');
		var clients = socket.eio.clientsCount;
		io.emit('test',  {message: 'We have lost a comrade! We still have '+clients+' connected.', count: clients});	

	});
					socket.on('event', function(data){
		console.log('IO EVENT: Leave', data);
		var clients = socket.eio.clientsCount;
		io.emit('test',  {message: 'We have lost a comrade! We still have '+clients+' connected.', count: clients});	

	});

	});

		




	// var mytest = function(){
	// 	console.log('mytest run');
	// var mydate = Date.now();
	// io.emit('test',  {message: 'Doing this bad boy'+mydate});	
	// setTimeout(mytest, 10000);
	// };

	// mytest();

};