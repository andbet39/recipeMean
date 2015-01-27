'use strict';

// Answers controller
angular.module('answers').controller('AnswersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Answers',
	function($scope, $stateParams, $location, Authentication, Answers) {
		$scope.authentication = Authentication;

		// Create new Answer
		$scope.createAnswer = function(enquire) {
			// Create new Answer object
			var answer = new Answers ({
				reason: this.answer.reason,
				enquire: enquire._id,
				isPro:this.answer.isPro
			});
			
			answer.$save();
			enquire.answers.unshift(answer);
			$scope.reason ='';
			$scope.isPro ='';
			// Redirect after save
			/*
			answer.$save(function(response) {
				$location.path('answers/' + response._id);
				$scope.reason ='';
				$scope.isPro ='';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
*/
		};

		// Create new Answer
		$scope.create = function() {
			// Create new Answer object
			var answer = new Answers ({
				reason: this.reason
			});

			// Redirect after save
			answer.$save(function(response) {
				$location.path('answers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Answer
		$scope.remove = function(answer) {
			if ( answer ) { 
				answer.$remove();

				for (var i in $scope.answers) {
					if ($scope.answers [i] === answer) {
						$scope.answers.splice(i, 1);
					}
				}
			} else {
				$scope.answer.$remove(function() {
					$location.path('answers');
				});
			}
		};

		// Update existing Answer
		$scope.update = function() {
			var answer = $scope.answer;

			answer.$update(function() {
				$location.path('answers/' + answer._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Answers
		$scope.find = function() {
			$scope.answers = Answers.query();
		};

		// Find existing Answer
		$scope.findOne = function() {
			$scope.answer = Answers.get({ 
				answerId: $stateParams.answerId
			});
		};
	}
]);