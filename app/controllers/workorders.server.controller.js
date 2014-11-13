'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	// errorHandler = require('./errors'),
	Workorder = mongoose.model('Workorder'),
	_ = require('lodash'),
	mandrill = require('mandrill-api/mandrill');

	var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	

/**
 * Create a Workorder
 */
exports.create = function(req, res) {
	var workorder = new Workorder(req.body);
	workorder.user = req.user;
	console.log('New WOrk Order: ', workorder);
	workorder.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * Show the current Workorder
 */
exports.read = function(req, res) {
	res.jsonp(req.workorder);
};

/**
 * Update a Workorder
 */
exports.update = function(req, res) {
	var workorder = req.workorder ;

	workorder = _.extend(workorder , req.body);

	workorder.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * Delete an Workorder
 */
exports.delete = function(req, res) {
	var workorder = req.workorder ;

	workorder.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorder);
		}
	});
};

/**
 * List of Workorders
 */
exports.list = function(req, res) { 

	console.log('Listing WOrk Orders Now');


	Workorder.find().sort('-created').populate('user', 'displayName').exec(function(err, workorders) {
		if (err) {
			return res.status(400).send({
				message: err //errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(workorders);
		}
	});
};

/**
 * Workorder middleware
 */
exports.workorderByID = function(req, res, next, id) { Workorder.findById(id).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		req.workorder = workorder ;
		next();
	});
};


exports.getByOffender = function(req, res, id) { 
	console.log('Get By OFfender: ', req.body);

		Workorder.find().where({offender: id}).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		// req.workorder = workorder ;
		res.status(200).send(workorder);
	});
};


exports.offenderByID = function(req, res, id) { 
	console.log('Work Order By ID: ', req.body);

		Workorder.find().where({offender: id}).populate('user', 'displayName').exec(function(err, workorder) {
		if (err) return next(err);
		if (! workorder) return next(new Error('Failed to load Workorder ' + id));
		// req.workorder = workorder ;
		res.status(200).send(workorder);
	});
};



/**
 * Workorder authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.workorder.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


exports.email = function(req, res){

	console.log('Emailing Now');
	console.log(req.body);
	var ip = req.header('x-forwarded-for') || req.connection.remoteAddress,
	timesrun = 0;


		var message = {
	'html': '<p>Work Authorization</p>',
	
	'subject': req.body.workinfo.subject,
	'from_email': req.body.user.email,
	'from_name': req.body.user.displayName,
	'to': [{
		'email': req.body.workinfo.email,
		'name': req.body.workinfo.toWhomName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': req.body.user.email
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.body.workinfo.email,
			'vars': [{
					'name': 'serviceCenter',
					'content': req.body.workinfo.serviceCenter
				},
				{
					'name': 'repname',
					'content': req.body.user.displayName
				},
				{
					'name': 'repemail',
					'content': req.body.user.email
				},
				{
					'name': 'repphone',
					'content': req.body.user.telephone
				},
				{
					'name': 'signip',
					'content': ip
				},
				{
					'name': 'workOrderId',
					'content': req.body.workinfo.id
				},
				{
					'name': 'workType',
					'content': req.body.workinfo.type
				},
				{
					'name': 'toName',
					'content': req.body.workinfo.toWhomName
				},
				{
					'name': 'serviceCenter',
					'content': req.body.workinfo.serviceCenter
				},
				{
					'name': 'customContent',
					'content': req.body.workinfo.content || ''
				},

				{
					'name': 'date',
					'content': new Date()
				},

				{
					'name': 'vehicleYear',
					'content': req.body.offender.vehicleYear
				},

				{
					'name': 'offenderName',
					'content': req.body.offender.firstName+' '+req.body.offender.lastName
				},
				{
					'name': 'vehicleMake',
					'content': req.body.offender.vehicleMake
				},
				{
					'name': 'vehicleModel',
					'content': req.body.offender.vehicleModel
				},
				{
					'name': 'driverNumber',
					'content': req.body.offender.driverNumber
				}




				]
	}],
	'important': false,
	'track_opens': null,
	'track_clicks': null,
	'auto_text': null,
	'auto_html': null,
	'inline_css': true,
	'url_strip_qs': null,
	'preserver_recipients': null,
	'view_content_link': null,
	'bcc_address': 'fivecsconsulting@gmail.com',
	'tracking_domain': null,
	'signing_domain': null,
	'return_path_domain': null,
	
};



var template_name='carefree-iid-workauth';

var async = false;
if(timesrun < 2){

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){
	timesrun++;
	console.log('Results from Mandrill', result);
},
function(e){
	//console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


}

};
		





