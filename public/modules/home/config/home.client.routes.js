'use strict';

//Setting up route
angular.module('home').config(['$stateProvider',
	function($stateProvider) {
		// Home state routing
		$stateProvider.
		state('myhome', {
			url: '/myhome',
			templateUrl: 'modules/home/views/homeindex.client.view.html'
		});
	}
]);