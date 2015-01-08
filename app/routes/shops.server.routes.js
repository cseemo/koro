'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var shops = require('../../app/controllers/shops');

	// Shops Routes
	app.route('/shops')
		.get(users.requiresLogin,shops.list)
		.post(users.requiresLogin, shops.create);

	
		app.route('/sendAgreement/:shopId')
		.get(shops.sendAgreement);

		app.route('/viewAgreement/:shopId')
		.get(shops.viewAgreement);

		app.route('/signAgreement/:shopId')
		.get(shops.signAgreement);

		app.route('/downloadPDF/:shopId')
		.get(shops.getSignedAgreement);

		app.route('/upload/shop/:shopId')
		.post(shops.uploadFile);

		app.route('/uploads/:shopId')
		.get(shops.getUploads);

		app.route('/countersign/:shopId')
		.get(shops.counterSign);

		app.route('/dlupload/:fileId')
		.get(shops.dlUpload)
		.post(shops.saveUpload);

		app.route('/removefile/:fileId')
		.get(shops.delFile);

		




		


		

	app.route('/shops/:shopId')
		.get(shops.read)
		.put(shops.update)
		.delete(users.requiresLogin, shops.hasAuthorization, shops.delete);

	// Finish by binding the Shop middleware
	app.param('shopId', shops.shopByID);
	app.param('fileId', shops.uploadByID);
};