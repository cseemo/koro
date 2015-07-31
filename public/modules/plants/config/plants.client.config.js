'use strict';

// Configuring the Articles module
angular.module('plants').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Plants', 'plants', 'dropdown', '/plants(/create)?');
		// Menus.addSubMenuItem('topbar', 'plants', 'List Plants', 'plants');
		// Menus.addSubMenuItem('topbar', 'plants', 'New Plant', 'plants/create');
	}
]);