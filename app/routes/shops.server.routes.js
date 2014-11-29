'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var shops = require('../../app/controllers/shops');

	// Shops Routes
	app.route('/shops')
		.get(shops.list)
		.post(users.requiresLogin, shops.create);

	
		app.route('/sendAgreement/:shopId')
		.get(shops.sendAgreement);
		
	app.route('/shops/:shopId')
		.get(shops.read)
		.put(users.requiresLogin, shops.hasAuthorization, shops.update)
		.delete(users.requiresLogin, shops.hasAuthorization, shops.delete);

	// Finish by binding the Shop middleware
	app.param('shopId', shops.shopByID);
};