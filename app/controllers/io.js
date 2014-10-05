
'use strict';

module.exports = function(io){
	
		var ss = 0;

		io.sockets.on('connection', function(socket){
		//console.log('IO EVENT: Connect', socket);
		////console.log('Req??', req);
		var clients = io.eio.clientsCount;
		io.emit('newconnect',  {type: 'connection',date: Date.now(), message: 'Hooray! Someone new connected '+clients+' now connected.', count: clients});	
		

			socket.on('disconnect', function(){
			//console.log('IO EVENT: Disconnect');
			var clients = io.eio.clientsCount;
			io.emit('newconnect',  {type: 'connection',date: Date.now(), message: 'Someone just left... '+clients+' now connected.', count: clients});	
		

	});

		socket.on('leave', function(){
		//console.log('IO EVENT: Leave');
		var clients = socket.eio.clientsCount;
		io.emit('test',  {message: 'We have lost a comrade! We still have '+clients+' connected.', count: clients});	

	});
		socket.on('message', function(data){
			
		//console.log('SS =',ss);
		//console.log('IO EVENT: %o', data);
		var n = data.type;
		//console.log('n=',n);
	


		
		switch(n){

			case 'quote': 
			io.emit('test',  {type: 'quote',date: Date.now(), lines: data.lines, deal: data.deal, user: data.user.displayName, mrc: data.mrc, dsl: data.dsl, message: data.user.displayName+' just sent a quote to '+data.deal+' for $'+data.mrc+'. ('+data.dsl+' - '+data.lines+' adl)'});	
			//io.emit('test',  {type: 'event', message: 'Making a new quote!!', user: $scope.authentication.user});	
			break;

			case 'approve': 
			io.emit(data.userid,  {type: 'approve',date: Date.now(), deal: data.deal, message: 'LOAs Approved for: '+data.deal+'. $'+data.mrc+' deal for '+data.user+'!!'});	
			//io.emit('test',  {type: 'event', message: 'Making a new quote!!', user: $scope.authentication.user});	
			break;

			case 'convert':
			//console.log('Deal converted');
			io.emit('test',  {type: 'convert', deal: data.deal, user: data.user, date: Date.now(), dealid: data.dealid});	
			break;

			case 'submit':
			//console.log('Deal Submitted');
			io.emit('test',  {type: 'submit',date: Date.now(), message: data.user+' just sent out an order packet for  '+data.deal+'!'});	
			break;

			case 'signin':
			//console.log('Signed In');
			io.emit('test', {type: 'signin',date: Date.now(), message: data.user+' just signed in.'});	
			break;

			case 'signout':
			//console.log('Signed In');
			io.emit('test',  {date: Date.now(), message: data.user+' just signed out.'});	
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
	// 	//console.log('mytest run');
	// var mydate = Date.now();
	// io.emit('test',  {message: 'Doing this bad boy'+mydate});	
	// setTimeout(mytest, 10000);
	// };

	// mytest();

};