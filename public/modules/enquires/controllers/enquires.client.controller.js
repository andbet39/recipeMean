'use strict';

// Enquires controller
angular.module('enquires').controller('EnquiresController', ['$scope','$http', '$stateParams', '$location', 'Authentication', 'Enquires',
	function($scope,$http, $stateParams, $location, Authentication, Enquires, Answers) {
		$scope.authentication = Authentication;

		$scope.answers ='';
 
		$scope.loadAnswer = function(enquire){
				console.log('loading answer for '+  enquire._id);

				$http.get('/enquireAnswer/'+ enquire._id).
					  success(function(data, status, headers, config) {
						    enquire.answers = data;
					  }).
					  error(function(data, status, headers, config) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					  });
		 };

		// Create new Enquire
		$scope.create = function() {
			// Create new Enquire object
			var enquire = new Enquires ({
				title: this.title,
				text: this.text
			});

			// Redirect after save
			enquire.$save(function(response) {
				$location.path('enquires/' + response._id);

				// Clear form fields
				$scope.title = '';
				$scope.text = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Enquire
		$scope.remove = function(enquire) {
			if ( enquire ) { 
				enquire.$remove();

				for (var i in $scope.enquires) {
					if ($scope.enquires [i] === enquire) {
						$scope.enquires.splice(i, 1);
					}
				}
			} else {
				$scope.enquire.$remove(function() {
					$location.path('enquires');
				});
			}
		};

		// Update existing Enquire
		$scope.update = function() {
			var enquire = $scope.enquire;

			enquire.$update(function() {
				$location.path('enquires/' + enquire._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Enquires
		$scope.find = function() {
			$scope.enquires = Enquires.query();
		};

		// Find existing Enquire
		$scope.findOne = function() {
			$scope.enquire = Enquires.get({ 
				enquireId: $stateParams.enquireId
			})
			.$promise.then(
				function (enquire) {
				   $http.get('/enquires/addVisit/'+ enquire._id).
					  success(function(data, status, headers, config) {
					  	console.log('visit counter updated');
 					  }).
					  error(function(data, status, headers, config) {
					    // called asynchronously if an error occurs
					    // or server returns response with an error status.
					});
				  $scope.loadAnswer(enquire);
				  $scope.enquire=enquire;

				  console.log(enquire)
				});
		};
	}
]);
