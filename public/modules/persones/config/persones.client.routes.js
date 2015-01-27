'use strict';

//Setting up route
angular.module('persones').config(['$stateProvider',
	function($stateProvider) {
		// Persones state routing
		$stateProvider.
		state('listPersones', {
			url: '/persones',
			templateUrl: 'modules/persones/views/list-persones.client.view.html'
		}).
		state('createPersone', {
			url: '/persones/create',
			templateUrl: 'modules/persones/views/create-persone.client.view.html'
		}).
		state('viewPersone', {
			url: '/persones/:personeId',
			templateUrl: 'modules/persones/views/view-persone.client.view.html'
		}).
		state('editPersone', {
			url: '/persones/:personeId/edit',
			templateUrl: 'modules/persones/views/edit-persone.client.view.html'
		});
	}
]);