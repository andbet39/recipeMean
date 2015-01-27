'use strict';

//Setting up route
angular.module('enquires').config(['$stateProvider',
	function($stateProvider) {
		// Enquires state routing
		$stateProvider.
		state('listEnquires', {
			url: '/enquires',
			templateUrl: 'modules/enquires/views/list-enquires.client.view.html'
		}).
		state('createEnquire', {
			url: '/enquires/create',
			templateUrl: 'modules/enquires/views/create-enquire.client.view.html'
		}).
		state('viewEnquire', {
			url: '/enquires/:enquireId',
			templateUrl: 'modules/enquires/views/view-enquire.client.view.html'
		}).
		state('editEnquire', {
			url: '/enquires/:enquireId/edit',
			templateUrl: 'modules/enquires/views/edit-enquire.client.view.html'
		});
	}
]);