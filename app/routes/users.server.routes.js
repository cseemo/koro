'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/users');
	app.route('/users/me').get(users.me);
	app.route('/users').get(users.list).put(users.update);
	app.route('/users/password').post(users.changePassword);
	app.route('/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the facebook oauth routes
	app.route('/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/auth/facebook/callback').get(users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/auth/twitter/callback').get(users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/auth/google/callback').get(users.oauthCallback('google'));

	// Setting the linkedin oauth routes
	app.route('/auth/linkedin').get(passport.authenticate('linkedin'));
	app.route('/auth/linkedin/callback').get(users.oauthCallback('linkedin'));

	//FIX THIS -- REQUIRES LOGIN
	app.route('/users/:userId/edit')
		.put(users.hasAuthorization(['admin', 'manager']), users.updateUser2)
		.get(users.showUser);
	

	//FIX THIS -- REQUIRES LOGIN
	app.route('/userspw/:userId/reset')
		.post(users.hasAuthorization(['admin']), users.resetPassword);
		
	app.route('/email/:userId/confirmation')
	.post(users.sendRegistration);

	app.route('/users/edit')
	.put(users.updateUser2)
	.get(users.list);

	app.route('/users/:userId')
	.post(users.updateUser2);
	

	app.route('/adminusers')
	//.put(users.requiresLogin, users.updateUser)
	.get(users.list);

	app.route('/setnewpw')
	.post(users.setnewPW);

	
	app.route('/reset_password/:userId')
	.get(users.userByID)
	.post(users.setnewPW);


	app.route('/forgot_password/:userName')
	.get(users.forgotPW);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
		app.param('userName', users.userByUsername);
};