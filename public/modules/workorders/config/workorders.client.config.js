'use strict';

// Configuring the Articles module
angular.module('workorders').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Workorders', 'workorders', 'dropdown', '/workorders(/create)?', 'fa fa-wrench');
		Menus.addSubMenuItem('topbar', 'workorders', 'List Workorders', 'workorders');
		Menus.addSubMenuItem('topbar', 'workorders', 'New Workorder', 'workorders/create');
	}
]);