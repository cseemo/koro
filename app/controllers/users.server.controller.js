'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	_ = require('lodash'),
	mandrill = require('mandrill-api/mandrill');

var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	



exports.list = function(req, res) { User.find().exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};

exports.sendRegistration = function(req, res){
	console.log('Sending Registration');
	console.log('Request',req);

		var message = {
	'html': 'Thank You for Registering',
	'text': 'Plain Text Email Content',
	'subject': 'Registration Confirmation',
	'from_email': 'admin@adsoap.com',
	'from_name': 'New Users',
	'to': [{
		'email': req.user.email,
		'name': req.user.displayName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'cseemo@gmail.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.user.email,
			'vars': [{
					'name': 'userid',
					'content': req.user._id
				},
				{
					'name': 'username',
					'content': req.user.username
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
	'return_path_domain': null
};



var template_name='register';

var async = false;

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	console.log('Results from Mandrill', result);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});




		
	return;
	




};

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

//Forgot Password
	exports.forgotPW = function(req, res){
		console.log('Resetting Password');




console.log('Request',req);

		var message = {
	// 'html': 'Thank You for Registering',
	// 'text': 'Plain Text Email Content',
	// 'subject': 'Registration Confirmation',
	// 'from_email': 'admin@adsoap.com',
	// 'from_name': 'New Users',
	'to': [{
		'email': req.profile.email,
		'name': req.profile.displayName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'cseemo@gmail.com'
	},
	'merge': true,
	'global_merge_vars': [{
		'name': 'merge1',
		'content': 'merge1 content'
	}],
	'merge_vars': [{
			'rcpt': req.profile.email,
			'vars': [{
					'name': 'userid',
					'content': req.profile._id
				},
				{
					'name': 'username',
					'content': req.profile.username
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
	'return_path_domain': null
};



var template_name='forgot-password';

var async = false;

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	console.log('Results from Mandrill', result);
},
function(e){
	console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


res.send('200', 'Password Reset for userid: '+req.profile._id);


	};

/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.send(400, err);
				} else {
					res.jsonp(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.send(400, info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.send(400, err);
				} else {
					res.jsonp(user);
				}
			});
		}
	})(req, res, next);
};


/**
 * Show the current Users Info
 */
exports.showUser = function(req, res) {
	// //console.log('Req.user %o ', req.user);
		//console.log('Req Params %o ', req.profile);
	res.jsonp(req.profile);
};

/**
 * Update user details
 */
exports.updateUser = function(req, res) {
	// Init Variables
	//console.log('req.userB?? %o ',req.params);
	var user = req.userB;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.send(400, err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.send(400, {
			message: 'User is not signed in'
		});
	}
};

exports.updateUser2 = function(req, res) {
	// Init Variables
	var user = req.profile;
	console.log('Should be user being updated', req.profile);
	var message = null;

	//Marin Drunken fix to deal with preSave webhook
	user.reusePassword = true;
	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		// //console.log('user req.body -- ??', req.body);
		// //console.log('user profile', req.profile);
		user.updated = Date.now();

		// //console.log('updating user??:', user);

		user.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				res.jsonp(user);
			}
		});
	} else {
		res.send(400, {
			message: 'Unable to update user'
		});
	}
};


/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.send(400, err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.send(400, {
			message: 'User is not signed in'
		});
	}
};

//Set New Password

exports.setnewPW = function(req, res) {
	// Init Variables
	
	console.log('Request',req);
	//console.log('Request.user',req.user)
	//console.log('Request.user',req.profile);
	console.log('Data', req.body);
	//res.send('200', 'Password Set')
	var user = req.profile;
	user.password = req.body.pw;
	user.resetPassword = true;
	user.save(function(err) {
							if (err) {
								return res.send(400, {
									message: getErrorMessage(err)
								});
							} else {
										res.send({
											message: 'Password changed successfully'
										});
									}
								});
							};
						



/**
 * Change Password
 */
exports.changePassword = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;
	//console.log('Password Details',req.body);
	var message = null;

	if (req.user) {
		User.findById(req.user.id, function(err, user) {
			if (!err && user) {
				if (user.authenticate(passwordDetails.currentPassword)) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;

						user.save(function(err) {
							if (err) {
								return res.send(400, {
									message: getErrorMessage(err)
								});
							} else {
								req.login(user, function(err) {
									if (err) {
										res.send(400, err);
									} else {
										res.send({
											message: 'Password changed successfully'
										});
									}
								});
							}
						});
					} else {
						res.send(400, {
							message: 'Passwords do not match'
						});
					}
				} else {
					res.send(400, {
						message: 'Current password is incorrect'
					});
				}
			} else {
				res.send(400, {
					message: 'User is not found'
				});
			}
		});
	} else {
		res.send(400, {
			message: 'User is not signed in'
		});
	}
};

//Reset Password
/**
 * Change Password
 */
exports.resetPassword = function(req, res) {
	// Init Variables
	//console.log('Reset Password');
	//var passwordDetails = req.body;
	//console.log('Req',req);
	var message = null;

	User.findById(req.body._id, function(err, user) {
	
	if(user){
		user.resetPassword = true;
		user.password = 'test1234';

		user.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		}else{

			//console.log('looks like the new password is updated',user.password);
			return res.send(200, 'Yeah baby!!');

}

});
		
		





}else{
	return res.send(400, {
				message: 'DId not find a user to update'
			});
}
	});

	//res.send(200, 'Getting There');

	// user.save(function(err) {
	// 						if (err) {
	// 							return res.send(400, {
	// 								message: getErrorMessage(err)
	// 							});
	// 						} else {
	// 							req.login(user, function(err) {
	// 								if (err) {
	// 									res.send(400, err);
	// 								} else {
	// 									res.send({
	// 										message: 'Password changed successfully'
	// 									});
	// 								}
	// 							});
	// 						}
	// 					});

	// if (req.user) {
	// 	User.findById(req.user.id, function(err, user) {
	// 		if (!err && user) {
	// 			if (user.authenticate(passwordDetails.currentPassword)) {
	// 				if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
	// 					user.password = passwordDetails.newPassword;

	// 					user.save(function(err) {
	// 						if (err) {
	// 							return res.send(400, {
	// 								message: getErrorMessage(err)
	// 							});
	// 						} else {
	// 							req.login(user, function(err) {
	// 								if (err) {
	// 									res.send(400, err);
	// 								} else {
	// 									res.send({
	// 										message: 'Password changed successfully'
	// 									});
	// 								}
	// 							});
	// 						}
	// 					});
	// 				} else {
	// 					res.send(400, {
	// 						message: 'Passwords do not match'
	// 					});
	// 				}
	// 			} else {
	// 				res.send(400, {
	// 					message: 'Current password is incorrect'
	// 				});
	// 			}
	// 		} else {
	// 			res.send(400, {
	// 				message: 'User is not found'
	// 			});
	// 		}
	// 	});
	// } else {
	// 	res.send(400, {
	// 		message: 'User is not signed in'
	// 	});
	// }
};

/**
 * Signout
 */
exports.signout = function(req, res) {
	io.emit('message', {type: 'signin', user: req.user.displayName});	
			
	req.logout();
	res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.jsonp(req.user || null);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
		passport.authenticate(strategy, function(err, user, redirectURL) {
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};

/**
 * User by Username to send email 
 */
exports.userByUsername = function(req, res, next, id) {
	User.findOne({
		username: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};


/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findOne({
		_id: id
	}).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load User ' + id));
		req.profile = user;
		next();
	});
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.send(401, {
			message: 'User is not logged in'
		});
	}

	next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(roles) {
	var _this = this;

	return function(req, res, next) {
		_this.requiresLogin(req, res, function() {
			if (_.intersection(req.user.roles, roles).length) {
				return next();
			} else {
				return res.send(403, {
					message: 'User is not authorized'
				});
			}
		});
	};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.send(400, err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	}
};