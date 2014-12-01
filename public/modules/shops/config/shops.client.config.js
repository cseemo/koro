'use strict';

// Configuring the Articles module
angular.module('shops').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Shops', 'shops', 'dropdown', '/shops(/create)?', 'fa fa-building-o');
		// Menus.addSubMenuItem('topbar', 'shops', 'List Shops', 'shops');
		// Menus.addSubMenuItem('topbar', 'shops', 'New Shop', 'shops/create');
	}
]);