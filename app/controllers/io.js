
'use strict';

module.exports = function(io){
	
	io.on('connect', function(){
		console.log('IO', io);
		var clients = io.eio.clientsCount;
		io.emit('test',  {message: 'Hooray! Someone new connected '+clients+' now connected.', count: clients});	

	});

		io.on('leave', function(){
		console.log('IO', io);
		var clients = io.eio.clientsCount-1;
		io.emit('test',  {message: 'We have lost a comrade! We still have '+clients+' connected.', count: clients});	

	});

	// var mytest = function(){
	// 	console.log('mytest run');
	// var mydate = Date.now();
	// io.emit('test',  {message: 'Doing this bad boy'+mydate});	
	// setTimeout(mytest, 10000);
	// };

	// mytest();

};