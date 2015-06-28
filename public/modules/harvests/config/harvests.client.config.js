'use strict';

// Configuring the Articles module
angular.module('harvests').run(['Menus',
	function(Menus) {
		// Set top bar menu items

		Menus.addMenuItem('topbar', 'Harvests', 'harvests', 'dropdown', '/harvests(/create)?', 'fa fa-tree');
		Menus.addSubMenuItem('topbar', 'harvests', 'List Harvests', 'harvests');
		Menus.addSubMenuItem('topbar', 'harvests', 'New Harvest', 'harvests/create');
		// Menus.addSubMenuItem('topbar', 'harvests', 'Edit Harvest', 'harvests/edit');
	}
]);