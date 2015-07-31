'use strict';

// Configuring the Articles module
angular.module('harvests').run(['Menus',
	function(Menus) {
		// Set top bar menu items

		// Menus.addMenuItem('topbar', 'Batches', 'harvests', 'dropdown', '/harvests(/create)?', 'fa fa-tree');
		// Menus.addSubMenuItem('topbar', 'harvests', 'List Batches', 'harvests');
		// Menus.addSubMenuItem('topbar', 'harvests', 'New Batch', 'harvests/create');
		// Menus.addSubMenuItem('topbar', 'harvests', 'Edit Harvest', 'harvests/edit');
	}
]);