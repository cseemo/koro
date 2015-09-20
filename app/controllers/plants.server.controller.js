'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Plant = mongoose.model('Plant'),
	_ = require('lodash'),
	 CronJob = require('cron').CronJob,
	Task = mongoose.model('Task'),
	async = require('async'),
	moment = require('moment');




//Every Morning at 5am Check to see which Clones were topped 2 weeks ago. Then Create a New Task to Top it Again
var checkForClones= new CronJob({
  cronTime: '10 8 01 * * 0-6',
  // cronTime: '0,10,20,30,40,50 * * * * 0-6',
  // cronTime: '0 * * * * 0-6',

  //Every minute at :00 - 7 days per week: '0 */1 * * * 1-7'
  onTick: function() {
  	console.log('Look for Clones that were Transfered TWO WEEKS AGO');
  	var today = new moment();
  	// var startDate = moment().hours(0).minutes(0).seconds(0);
	var convertedPretty = moment(today).format("MM/DD/YYYY hh:mm:ss");
	
    console.log('Running Ontick!!', convertedPretty);
    checkClonesForTopping(convertedPretty, function(data){
    		console.log('Done Looking for Clones..', data);
    });
  },
  start: false,
  // timeZone: "America/Los_Angeles"
});

// console.log('Job.start about to executie!!');
checkForClones.start();


var checkClonesForTopping = function(date, callback){
	console.log('Checking for Clones that need a topping...');

	
	var twoWeeksAgo = new moment().subtract(14, 'days').subtract(3, 'hours').format("MM/DD/YYYY hh:mm:ss");
	var start = moment(twoWeeksAgo).hours(0).minutes(0).seconds(0);
	var end = moment(twoWeeksAgo).hours(23).minutes(59).seconds(59);
	var today = new moment();
	console.log('After '+start._d+' and Before '+end._d);



	Plant.find({created: {$lte:new Date(end), $gte: new Date(start)}}).exec(function(err, clones) {
		if (err) {
			console.log('Error finding Cloen...line 46: ', err);
			return callback(err);
			
		} else {
			console.log(clones);
			//Go thru each using Async
			//Generate a New Task to Top it due today by 5pm
			//Easy, Peezy, Lemon Squeezy
			async.forEach(clones, function(plant, mycallback){
				console.log(plant);
				//Create a New Task to Top That Plant
				var task = new Task();
				task.name = 'Top Plant ',
				task.details = 'Top Plant ID:'+plant.plantId+' in Room '+plant.roomId;
				task.dueDate = new moment(today).hours(20).minutes(0).seconds(0);
				task.status = 'Pending Assignment';


				task.save(function(err) {
					if (err) {
						return mycallback(err);
					} else {
						console.log('Just Saved Task');
						return mycallback(null, task);
						
					}
				});




			}, function(){
				console.log('Completed w/ clones...');
				return callback('Good');
			});

			
		}


	});


};


/**
 * Create a Plant
 */
exports.create = function(req, res) {
	var plant = new Plant(req.body);
	plant.user = req.user;

	plant.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};


//Final Weigh In
exports.finalWeighIn = function(req, res){
	console.log('Final weigh in...');
	console.log(req.body);
	var batchId = req.body.harvest.batchId;
	console.log('Batch ID: ', batchId);

	async.forEach(req.body.plants, function(ourPlant, myCallback){
		if(ourPlant.plantObjectId){


		Plant.findById(ourPlant.plantObjectId).populate('user', 'displayName').exec(function(err, plant) {
			if(err){
				console.log('Error finding plant...', err);
			}
			if(!plant){
				console.log('Cannot Find a plant...', ourPlant.plantObjectId);
			}else{
				console.log('Found our plant...', plant);
				plant.batchId = batchId;
				plant.plantWeighIn = Date.now();
				plant.wasteWeight = ourPlant.wasteWeight;
				plant.trimWeight = ourPlant.trimWeight;
				plant.aBudsWeight = ourPlant.aBudsWeight;
				plant.bBudsWeight = ourPlant.bBudsWeight;

				plant.save(function(){
					console.log('Saved the plant!!!');
					myCallback();
				})
			}
		});
	}else{
		console.log('Nothing to do here...');
		myCallback();
	}

	}, function(){
		console.log('Done...');
		res.status(200).send('Done');
	});
	
};

/**
 * Show the current Plant
 */
exports.read = function(req, res) {
	res.jsonp(req.plant);
};

/**
 * Update a Plant
 */
exports.update = function(req, res) {
	var plant = req.plant ;

	plant = _.extend(plant , req.body);

	plant.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};

/**
 * Delete an Plant
 */
exports.delete = function(req, res) {
	var plant = req.plant ;

	plant.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plant);
		}
	});
};

/**
 * List of Plants
 */
exports.list = function(req, res) { 
	Plant.find(req.query).sort('-created').populate('user', 'displayName').exec(function(err, plants) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(plants);
		}
	});
};

/**
 * Plant middleware
 */
exports.plantByID = function(req, res, next, id) { 
	Plant.findById(id).populate('user', 'displayName').exec(function(err, plant) {
		if (err) return next(err);
		if (! plant) return next(new Error('Failed to load Plant ' + id));
		req.plant = plant ;
		next();
	});
};

/**
 * Plant authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	// if (req.plant.user.id !== req.user.id) {
	// 	return res.status(403).send('User is not authorized');
	// }
	next();
};
