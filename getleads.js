var request = require("request");
var MongoClient = require('mongodb').MongoClient, 
	format = require('util').format;
 
request('https://script.google.com/macros/s/AKfycbwRM0AWlTwLf_YGaSfTpygjEO2uI0J0G5AuzBGBOINhT_D1JlZo/exec', function(err, response, body){
	console.log('response: ', response.statusCode);
	data = JSON.parse(body);
	console.log('items: ', data.length);
	console.log('item 1: ', data[0]);
 
	console.log('item 1 modified: ', Object.defineProperty(data[0], 'dateAdded', { 
		value: Date.now(),
		writeable: true,
		enumerable: true,
		configurable: true
	}));
 
	var counter = 0;
 
	if(response.statusCode === 200) {
		
 
		MongoClient.connect('mongodb://localhost:27017/mean-dev', function(err, db) {
		    if(err) throw err;
 
		    var collection = db.collection('leads');
		    //for(i in data) {
		   	for(var i = 0; i < 300; i++){
		   		console.log('Lead :'+data[i].Company);
 
		   		if(data[i].Company.length > 1) {
		   			console.log('Inserting a document'+data[i].Company);
		   			    collection.insert({
			    		companyname: data[i].Company,
			    		zipcode: data[i].Zipcode,
			    		state: data[i].State,
			    		city: data[i].City,
			    		address: data[i].Address,
			    		telephone: data[i].Phone_Number,
			    		contactname: data[i].Contact,
			    		speed: data[i].Speed,
			    		currentCarrier: data[i].Current_Carrier,
			    		created: Date.now(),
			    		lastCalled: null,
			    		__v: 0
			    	}, function(err, doc){
			    		//console.log('Write Result %o', WriteResult);
			    		console.log('inserted document: %d ', counter, doc[0].Company);
			    		counter++;
			    		if(counter >= data.length){
			    			db.close();
			    		}
		    		});	
		   		}
		   		console.log('Looking #'+i+': %o ', data[i]);
		    }

		    console.log('Sucess! importing %d leads', data.length);
		});
	}
})