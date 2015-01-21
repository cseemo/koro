'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('forgotpassword', {
			url: '/forgot_password',
			templateUrl: 'modules/users/views/forgotpw.client.view.html'
		}).
		state('resetpassword', {
			url: '/reset_password/:userId',
			templateUrl: 'modules/users/views/resetpw.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/signup.client.view.html'
		}).
		state('shopSignup', {
			url: '/newshopsignup',
			templateUrl: 'modules/users/views/shopsignup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/signin.client.view.html'
		}).
		state('edituser', {
			url: '/users/:userId/edit',
			templateUrl: 'modules/admin/views/edit-user.client.view.html'
		}).
		state('editusers', {
			url: '/adminusers',
			templateUrl: 'modules/admin/views/useroverview.client.view.html'
		}).
		state('pwreset', {
			url: 'userspw/:userId/reset',
			templateUrl: 'modules/admin/views/useroverview.client.view.html'
		}).
		state('confirm', {
			url: 'email/:userId/confirmation',
			templateUrl: 'modules/admin/views/useroverview.client.view.html'
		});;
	}
]);