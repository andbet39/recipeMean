'use strict';

// Configuring the Articles module
angular.module('enquires').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Enquires', 'enquires', 'dropdown', '/enquires(/create)?');
		Menus.addSubMenuItem('topbar', 'enquires', 'List Enquires', 'enquires');
		Menus.addSubMenuItem('topbar', 'enquires', 'New Enquire', 'enquires/create');
	}
]);