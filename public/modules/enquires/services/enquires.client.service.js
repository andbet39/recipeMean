'use strict';

//Enquires service used to communicate Enquires REST endpoints
angular.module('enquires').factory('Enquires', ['$resource',
	function($resource) {
		return $resource('enquires/:enquireId', { enquireId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);