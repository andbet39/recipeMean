'use strict';

//Persones service used to communicate Persones REST endpoints
angular.module('persones').factory('Persones', ['$resource',
	function($resource) {
		return $resource('persones/:personeId', { personeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);