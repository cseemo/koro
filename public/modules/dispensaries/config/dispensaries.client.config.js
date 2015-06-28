'use strict';

// Configuring the Articles module
angular.module('dispensaries').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Dispensaries', 'dispensaries', 'dropdown', '/dispensaries(/create)?', 'fa fa-building');
		Menus.addSubMenuItem('topbar', 'dispensaries', 'List Dispensaries', 'dispensaries');
		Menus.addSubMenuItem('topbar', 'dispensaries', 'New Dispensary', 'dispensaries/create');
	}
]);