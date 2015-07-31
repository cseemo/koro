'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Harvest = mongoose.model('Harvest'),
	Plant = mongoose.model('Plant'),
	_ = require('lodash');


exports.getStage1Plants = function(req, res){
	console.log('Get stage 1 plants...');
	Plant.find({stage1Complete: false, stage2Complete: false, stage3Complete: false, inProduction: true}).exec(function(err, plants){
		console.log("Plants::: ", plants);
		res.status(200).send(plants);
	});


};

exports.getStage2Plants = function(req, res){
	console.log('Get stage 1 plants...');
	Plant.find({stage1Complete: true, stage2Complete: false, stage3Complete: false, inProduction: true}).exec(function(err, plants){
		console.log("Plants::: ", plants);
		res.status(200).send(plants);
	});


};



exports.getStage3Plants = function(req, res){
	console.log('Get stage 1 plants...');
	Plant.find({stage1Complete: true, stage2Complete: true, stage3Complete: false, inProduction: true}).exec(function(err, plants){
		console.log("Plants::: ", plants);
		res.status(200).send(plants);
	});


};

exports.getReadyToHarvestPlants = function(req, res){
	console.log('Get Ready to harvest plants...');
	Plant.find({stage1Complete: true, stage2Complete: true, stage3Complete: true, inProduction: true}).exec(function(err, plants){
		console.log("Plants::: ", plants);
		res.status(200).send(plants);
	});


};

/**
 * Create a Harvest
 */
exports.create = function(req, res) {
	var harvest = new Harvest(req.body);
	harvest.user = req.user;

	harvest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(harvest);
		}
	});
};

/**
 * Show the current Harvest
 */
exports.read = function(req, res) {
	res.jsonp(req.harvest);
};

/**
 * Update a Harvest
 */
exports.update = function(req, res) {
	var harvest = req.harvest ;

	harvest = _.extend(harvest , req.body);

	harvest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(harvest);
		}
	});
};

/**
 * Delete an Harvest
 */
exports.delete = function(req, res) {
	var harvest = req.harvest ;

	harvest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(harvest);
		}
	});
};

/**
 * List of Harvests
 */
exports.list = function(req, res) { 
	Harvest.find().sort('-created').populate('user', 'displayName').exec(function(err, harvests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(harvests);
		}
	});
};

/**
 * Harvest middleware
 */
exports.harvestByID = function(req, res, next, id) { 
	Harvest.findById(id).populate('user', 'displayName').exec(function(err, harvest) {
		if (err) return next(err);
		if (! harvest) return next(new Error('Failed to load Harvest ' + id));
		req.harvest = harvest ;
		next();
	});
};

/**
 * Harvest authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.harvest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
