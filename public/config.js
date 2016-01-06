'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'Budget';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'ui.utils', 'ui.tree', 'easypiechart', 'textAngular', 'ngMap', 'ngTagsInput', 'btford.socket-io', 'ngTouch', 'xeditable', 'uiGmapgoogle-maps'];
	//'ngTouch', 
// , 'uiGmapgoogle-maps'
	// Add a new vertical module
	var registerModule = function(moduleName) {
		// Create angular module
		angular.module(moduleName, []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();