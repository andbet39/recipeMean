'use strict';

// Configuring the Articles module
angular.module('persones').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Persones', 'persones', 'dropdown', '/persones(/create)?');
		Menus.addSubMenuItem('topbar', 'persones', 'List Persones', 'persones');
		Menus.addSubMenuItem('topbar', 'persones', 'New Persone', 'persones/create');
	}
]);