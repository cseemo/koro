
'use strict';

module.exports = function(io){
	
		var ss = 0;

		io.sockets.on('connection', function(socket){
		console.log('IO EVENT: Connect', socket);
		//console.log('Req??', req);
		var clients = io.eio.clientsCount;
		io.emit('test',  {type: 'connection',date: Date.now(), message: 'Hooray! Someone new connected '+clients+' now connected.', count: clients});	
		

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
		socket.on('message', function(data){
			
			console.log('SS =',ss);
		console.log('IO EVENT: %o', data);
		var n = data.type;
		console.log('n=',n);
	


		
		switch(n){

			case 'quote': 
			io.emit('test',  {date: Date.now(), message: data.user.displayName+' just sent a quote to '+data.deal+' for $'+data.mrc+'! # of Adl Lines ('+data.lines+')'});	
			//io.emit('test',  {type: 'event', message: 'Making a new quote!!', user: $scope.authentication.user});	
			break;

			case 'approve': 
			io.emit(data.userid,  {date: Date.now(), deal: data.deal, message: 'LOAs Approved for: '+data.deal+'. $'+data.mrc+' deal for '+data.user+'!!'});	
			//io.emit('test',  {type: 'event', message: 'Making a new quote!!', user: $scope.authentication.user});	
			break;

			case 'convert':
			console.log('Deal converted');
			io.emit('test',  {date: Date.now(), message: data.user+' just converted '+data.deal+' from a Lead to a Deal!'});	
			break;

			case 'submit':
			console.log('Deal Submitted');
			io.emit('test',  {date: Date.now(), message: data.user+' just sent out an order packet for  '+data.deal+'!'});	
			break;

			case 'newconnect':
			io.emit('newconnect',  {type: 'connection',date: Date.now(), message: 'Hooray! Someone new connected '+clients+' now connected.', count: clients});	
			break;

			default:
			io.emit('test',  {date: Date.now(), message: 'Something else'});	
			break;

		}
		ss++;
	
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