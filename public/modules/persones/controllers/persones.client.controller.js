'use strict';

// Persones controller
angular.module('persones').controller('PersonesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Persones',
	function($scope, $stateParams, $location, Authentication, Persones) {
		$scope.authentication = Authentication;

		// Create new Persone
		$scope.create = function() {
			// Create new Persone object
			var persone = new Persones ({
				name: this.name
			});

			// Redirect after save
			persone.$save(function(response) {
				$location.path('persones/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Persone
		$scope.remove = function(persone) {
			if ( persone ) { 
				persone.$remove();

				for (var i in $scope.persones) {
					if ($scope.persones [i] === persone) {
						$scope.persones.splice(i, 1);
					}
				}
			} else {
				$scope.persone.$remove(function() {
					$location.path('persones');
				});
			}
		};

		// Update existing Persone
		$scope.update = function() {
			var persone = $scope.persone;

			persone.$update(function() {
				$location.path('persones/' + persone._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Persones
		$scope.find = function() {
			$scope.persones = Persones.query();
		};

		// Find existing Persone
		$scope.findOne = function() {
			$scope.persone = Persones.get({ 
				personeId: $stateParams.personeId
			});
		};
	}
]);