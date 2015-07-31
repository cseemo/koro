'use strict';

// Configuring the Articles module
angular.module('clones').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Clones', 'clones', 'dropdown', '/clones(/create)?', 'fa fa-scissors');
		
		// Menus.addSubMenuItem('topbar', 'clones', 'Create New Clones', 'clones/create');
		// // Menus.addSubMenuItem('topbar', 'clones', 'List Clones', 'clones');
		// Menus.addSubMenuItem('topbar', 'clones', 'Transfer to Flood & Drain', 'clones/transfer1');
		// Menus.addSubMenuItem('topbar', 'clones', 'Transfer Clones to 3 Gallon', 'clones/transfer2');
	}
]);