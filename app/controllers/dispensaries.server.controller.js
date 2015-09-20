'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dispensary = mongoose.model('Dispensary'),
	_ = require('lodash');
	var request = require('request');
var _ = require('lodash');
var cheerio = require('cheerio');
var async = require('async');

//Get Specials from Leafly
exports.getSpecials = function(req, res){
console.log('Getting Specials...');

var myData = [];
var results = [];
var counter = 0;
var url;

if(req.query.dispID){
	console.log('Just need one locations specials...');
	Dispensary.findById(req.query.dispID).populate('user', 'displayName').exec(function(err, dispensary) {
		if (err) return next(err);
		if (! dispensary) return next(new Error('Failed to load Dispensary ' + id));
		console.log('Got our dispensary ', dispensary);
		var url = dispensary.url;
	request(url, function(err, response, body){
	// console.log('response: ', response.statusCode);
	// data = JSON.parse(body);
	// console.log('Body: ', body);
		var parsedHTML = cheerio.load(body, {
			normalizeWhitespace: true,
			xmlMode: true

		});
	// console.log(parsedHTML.text());

	var name =	parsedHTML('h1').text();
			console.log('Test Name: ', name);
	


				//Grabe Each <li> with the class that Specials have (paddingBottom)
				//Otherwise we get menu items too
				parsedHTML('li', '.l-content--paddingBottom').map(function(i, link) {
				
				//Break open each <li>
				var child = cheerio(link).children().text();


				//Each child is a special
				console.log('Special #'+i+': '+child);
				results.push(child);
				// results.push(child);
				
			});

console.log('Results: ', results);
console.log('-----------------------'+counter+'------------------------');
counter++;
myData.push({'name': name, 'data': results});

return res.status(200).send(myData);

});

});

}else{
	console.log('Need all of the locations specials...');
Dispensary.find().sort('-created').populate('user', 'displayName').exec(function(err, dispensaries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			
			if(dispensaries.length < 1){
				console.log('No Dispensaries....');
				return res.status(400).send('No Dispensaries...');

			}


			async.forEach(dispensaries, function(disp, callback){

	console.log('Dispensary Info: ', disp);
	url = disp.url;

	console.log('Starting a URL: ', url);

request(url, function(err, response, body){
	// console.log('response: ', response.statusCode);
	// data = JSON.parse(body);
	// console.log('Body: ', body);
		var parsedHTML = cheerio.load(body, {
			normalizeWhitespace: true,
			xmlMode: true

		});
	// console.log(parsedHTML.text());

	var name =	parsedHTML('h1').text();
			console.log('Test Name: ', name);
	


				//Grabe Each <li> with the class that Specials have (paddingBottom)
				//Otherwise we get menu items too
				parsedHTML('li', '.l-content--paddingBottom').map(function(i, link) {
				
				//Break open each <li>
				var child = cheerio(link).children().text();


				//Each child is a special
				console.log('Special #'+i+': '+child);
				results.push(child);
				// results.push(child);
				
			});

console.log('Results: ', results);
console.log('-----------------------'+counter+'------------------------');
counter++;
myData.push({'name': name, 'data': results});
results =[];

if(counter===dispensaries.length){
	console.log('COmpleted '+counter+' dispensaries - lets go home!!!');
	callback(counter);
}

})

	
}, function(results){
					console.log('Done getting dispensaries...hopefully...');
					console.log(results);
					res.status(200).send(myData);
				});

}
});
}

};
/**
 * Create a Dispensary
 */
exports.create = function(req, res) {
	var dispensary = new Dispensary(req.body);
	dispensary.user = req.user;

	dispensary.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dispensary);
		}
	});
};

/**
 * Show the current Dispensary
 */
exports.read = function(req, res) {
	res.jsonp(req.dispensary);
};

/**
 * Update a Dispensary
 */
exports.update = function(req, res) {
	var dispensary = req.dispensary ;

	dispensary = _.extend(dispensary , req.body);

	dispensary.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dispensary);
		}
	});
};

/**
 * Delete an Dispensary
 */
exports.delete = function(req, res) {
	var dispensary = req.dispensary ;

	dispensary.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dispensary);
		}
	});
};

/**
 * List of Dispensaries
 */
exports.list = function(req, res) { 
	Dispensary.find().sort('-created').populate('user', 'displayName').exec(function(err, dispensaries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dispensaries);
		}
	});
};

/**
 * Dispensary middleware
 */
exports.dispensaryByID = function(req, res, next, id) { 
	Dispensary.findById(id).populate('user', 'displayName').exec(function(err, dispensary) {
		if (err) return next(err);
		if (! dispensary) return next(new Error('Failed to load Dispensary ' + id));
		req.dispensary = dispensary ;
		next();
	});
};

/**
 * Dispensary authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.dispensary.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};
