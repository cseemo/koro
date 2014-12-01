'use strict';

// Configuring the Articles module
angular.module('offenders').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		// Menus.addMenuItem('topbar', 'Offenders', 'offenders', 'dropdown', '/offenders(/create)?', 'fa fa-male');
		// Menus.addSubMenuItem('topbar', 'offenders', 'List Offenders', 'offenders');
		// Menus.addSubMenuItem('topbar', 'offenders', 'New Offender', 'offenders/create');
	}
]);