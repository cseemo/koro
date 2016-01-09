'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Upload = mongoose.model('Upload'),
	_ = require('lodash'),
	mandrill = require('mandrill-api/mandrill');

	var fs=require('fs');
	// var inspect = require('util').inspect;
	// var multer = require('multer');
	// var Busboy = require('busboy');
	var path = require('path');
	var async = require('async');
	var request = require('request');

var mandrill_client = new mandrill.Mandrill('vAEH6QYGJOu6tuyxRdnKDg');
	
	//Test Cam Movement
	exports.testMovement = function(req, res){
		console.log('Moving cam...');
		console.log(req.body);

		
	
		request.get({
			url: req.body.url, 
			

		}, function(err, data){
			console.log('err', err);
			console.log('data', data);
			res.status(200).send('Done');
		});
	



		
	};


exports.testFiles = function(req, res){
	console.log('About to test get some files...');
	console.log(req.query.fileNum);
	var fileNum = 0;
	if(req.query.fileNum) fileNum = req.query.fileNum;

	var files = [];

	function walk(currentDirPath, callback) {
   
    fs.readdirSync(currentDirPath).forEach(function(name) {
	        var filePath = path.join(currentDirPath, name);
	        var stat = fs.statSync(filePath);
	        if (stat.isFile()) {
	            callback(filePath, stat);
	        } else if (stat.isDirectory()) {
	            walk(filePath, callback);
	        }
	    });
	}


	walk('/opt/koro/ipvideo', function(filePath, stat) {
    		console.log("filepath: ", filePath);
    		console.log(stat);
    		files.push(filePath);
	});

	walk('/opt/koro/ipcam', function(filePath, stat) {
    		console.log("filepath: ", filePath);
    		console.log(stat);
    		files.push(filePath);
	});
	
	walk('/opt/koro/share', function(filePath, stat) {
    		console.log("filepath: ", filePath);
    		console.log(stat);
    		files.push(filePath);
	});

	walk('/opt/koro/public/share', function(filePath, stat) {
    		console.log("filepath: ", filePath);
    		console.log(stat);
    		files.push(filePath);

	});

	walk('/opt/koro/20160106', function(filePath, stat) {
    		console.log("filepath: ", filePath);
    		console.log(stat);
    		files.push(filePath);

	});

	walk('public/share/ipvideo', function(filePath, stat) {
    		console.log("filepath: ", filePath);
    		console.log(stat);
    		files.push(filePath);

	});


	

		console.log('Finished...');
		setTimeout(function(){
			console.log('Timeout finished...');
			console.log(files.length+' files sorted through....');
			// return res.status(200).send(files);
			if(files[fileNum]) {
				res.download(files[fileNum]);
			}else{
				console.log('That is not a valid fileNum...', fileNum);
				res.download(files[fileNum-1]);
			}
		}, 1500);

};
//Save Upload
var uploadFile = function (fileInfo) {
	console.log('Uploading File');
    console.log('Got to post');
	console.log('Request.files', fileInfo);
	var fileStuff = fileInfo.split('_');
	var time = fileStuff[2];
	var camera = fileStuff[0];
	var date = fileStuff[1];
	var hourFolder = null;
	if(time){
		console.log('Older Camera');
		hourFolder = time.substr(0,2);
	}else{
		console.log('Newer camera');
		hourFolder = Unknown;
		time = 'Need to parse still';
	}
	

	
	//Hopefully we have disected the File Name properly
	console.log('Folder New Image Goes In: ', date);
	console.log('Subfolder /'+date+'/'+hourFolder);
	console.log('Camera Unique Identifier: ', camera);
	console.log('Time of EVent: ', time);

	var files = false;



  //   	var rootDir = path.normalize(__dirname + '../../../'),
		// publicDir = rootDir + 'public',
		// relativeDir = 'public/uploads/files',
		// uploadDir = relativeDir+'/'+req.shop._id, 
		// uploadURL = '/uploads/' + req.shop._id,
		// imageTypes= /\.(gif|jpe?g|png)$/i;
		// console.log('Public Dir: ', publicDir);
		// var util = require('util');

		var upload = new Upload({
				filename: fileInfo,
				location: '/share',
				url: 'share/' + fileInfo,
				camera: camera
				
			});

		upload.save(function(err, data){
			console.log(err);
			console.log('Upload saved...', data);
		});

};
console.log('User controller live');

 console.log('Firing up new FTP Server...');
// var ftpd = require('ftp-server')
var ftpd = require('ftpd');
var options = {
  host: '159.203.209.180',
  port: 3331,
  tls: null
};
var server;

var testMe = function(){
	console.log('test me called..');
server = new ftpd.FtpServer(options.host, {
  getInitialCwd: function() {
    return '/public/share';
  },
  getRoot: function() {
    return process.cwd();
  },
  size: function(){
  	console.log("What is the size...");
  	return 'pass';
  },
  pasvPortRangeStart: 10050,
  pasvPortRangeEnd: 15000,
  tlsOptions: options.tls,
  allowUnauthorizedTls: true,
  useWriteFile: true,
  useReadFile: false,
  uploadMaxSlurpSize: 25000 // N/A unless 'useWriteFile' is true.
});

server.on('error', function(error) {
  console.log('FTP Server error:', error);
});

server.on('client:details', function(sock) {
  
  console.log('Details');
  console.log(sock)

});

server.on('storeCommand', function(details){
	console.log("About to store a file...");
	console.log(details);
	uploadFile(details);
});

server.on('client:connected', function(connection) {
  var username = null;
  console.log('client connected: ');

  console.log(connection);
  connection.on('command:user', function(user, success, failure) {
  	console.log('Comman user');
  	console.log(user);
  	success();
    // if (user) {
    //   username = user;
    //   success();
    // } else {
    //   failure();
    // }
  });

  connection.on('command:pass', function(pass, success, failure) {
  	console.log('Psasss');
  	console.log(pass);
  	success('test');

    // if (pass) {
    //   success(username);
    // } else {
    //   failure();
    // }
  });

  connection.on('command', function(data) {
  	console.log('Command');
  	console.log(data);
  });
});

server.debugging = 4;
server.listen(options.port);
console.log('Listening on port ' + options.port);

};

testMe();

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


		exports.delete = function(req, res) {
			//console.log('Request is: ',req);
	var user = req.profile ;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: err
			});
		} else {
			res.status(200).send('User has been Deleted');
		}
	});
};

exports.sendRegistration = function(req, res){
	//console.log('Sending Registration');
	//console.log('Request',req);

		var message = {
	'html': 'Thank You for Registering',
	'text': 'Plain Text Email Content',
	'subject': 'Registration Confirmation',
	'from_email': 'admin@korokonnections.com',
	'from_name': 'New Users',
	'to': [{
		'email': req.user.email,
		'name': req.user.displayName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'fivecsconsulting@gmail.com'
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



var template_name='koro-registration';

var async = false;

//CANCEL EMAILING UNTIL WE HAVE A TEMPLATE BUILT -- ALOS NEED TO FIX WHY IT RUNS thrice - I FIXED IT ON SUNRISE
mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	//console.log('Results from Mandrill', result);
},
function(e){
	//console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
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




//console.log('Request',req);

		var message = {
	
	'text': 'Plain Text Email Content',
	'subject': 'Password Reset Instructions',
	'from_email': 'admin@korokonnections.com',
	'from_name': 'Koro Konnections',
	'to': [{
		'email': req.profile.email,
		'name': req.profile.displayName,
			'type': 'to'
	}],
	'headers': {
		'Reply-To': 'fivecsconsulting@gmail.com'
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



var template_name='koro-forgot-password';

var async = false;

mandrill_client.messages.sendTemplate({
	'template_name': template_name,
	'template_content': [],
	'message': message, 
	'async': async
}, function(result){

	//console.log('Results from Mandrill', result);
},
function(e){
	//console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
});


res.status(200).send('Password Reset for userid: '+req.profile._id);


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
	if(req.body.isShop===true){
		console.log('Shop is true');
		user.roles.push('shop');

	}
	console.log('User is: ', user);

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;

			req.login(user, function(err) {
				if (err) {
					res.status(401).send(err);
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
	console.log('Signing in');
	console.log('Request Info: ', req.body);
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			console.log('Got an err line 287 - User Server Controller');
			res.status(400).send(info);
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			console.log('About to Login in');
			req.login(user, function(err) {
				if (err) {
					console.log('Error User Controller 296');
						res.status(400).send(err);
				} else {
					console.log('Singed In - returning user');
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
	// ////console.log('Req.user %o ', req.user);
		////console.log('Req Params %o ', req.profile);
	res.jsonp(req.profile);
};

/**
 * Update user details
 */
exports.updateUser = function(req, res) {
	// Init Variables
	////console.log('req.userB?? %o ',req.params);
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
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.updateUser2 = function(req, res) {
	// Init Variables
	var user = req.profile;
	//console.log('Should be user being updated', req.profile);
	var message = null;

	//Marin Drunken fix to deal with preSave webhook
	user.reusePassword = true;
	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		// ////console.log('user req.body -- ??', req.body);
		// ////console.log('user profile', req.profile);
		user.updated = Date.now();

		// ////console.log('updating user??:', user);

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				res.jsonp(user);
			}
		});
	} else {
		res.status(400).send({
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
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

//Set New Password

exports.setnewPW = function(req, res) {
	// Init Variables
	
	//console.log('Request',req);
	////console.log('Request.user',req.user)
	////console.log('Request.user',req.profile);
	//console.log('Data', req.body);
	//res.send('200', 'Password Set')
	var user = req.profile;
	user.password = req.body.pw;
	user.resetPassword = true;
	user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: getErrorMessage(err)
								});
							} else {
										res.status(200).send({
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
	////console.log('Password Details',req.body);
	var message = null;

	if (req.user) {
		User.findById(req.user.id, function(err, user) {
			if (!err && user) {
				if (user.authenticate(passwordDetails.currentPassword)) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;

						user.save(function(err) {
							if (err) {
								return res.status(400).send({
									message: getErrorMessage(err)});
							
							} else {
								req.login(user, function(err) {
									if (err) {
										res.status(400).send(err);
									} else {
										res.status(200).send({
											message: 'Password changed successfully'
										});
									}
								});
							}
						});
					} else {
						res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				} else {
					res.status(400).send({
						message: 'Current password is incorrect'
					});
				}
			} else {
				res.status(400).send({
					message: 'User is not found'
				});
			}
		});
	} else {
		res.status(400).send({
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
	////console.log('Reset Password');
	//var passwordDetails = req.body;
	////console.log('Req',req);
	var message = null;

	User.findById(req.body._id, function(err, user) {
	
	if(user){
		user.resetPassword = true;
		user.password = 'test1234';

		user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		}else{

			////console.log('looks like the new password is updated',user.password);
			return res.status(200).send('Yeah baby!!');

}

});
		
		





}else{
	return res.status(400).send({
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
	// io.emit('message', {type: 'signin', user: req.user.displayName});	
			
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
	// console.log('Require Login', req.body);
	if (!req.isAuthenticated()) {
		return res.status(401).send({
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
				return res.status(403).send({
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
				return res.status(400).send({
					message: getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	}
};