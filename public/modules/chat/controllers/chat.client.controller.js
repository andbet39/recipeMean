'use strict';

angular.module('chat').controller('ChatController', ['$scope','Chat','Authentication', function($scope, Chat,Authentication) {

		$scope.userinfo =Authentication.user;

		$scope.messages = Chat.all;

		$scope.send  = function(message){

			message.userinfo=Authentication.user
			Chat.create(message)
			$scope.message ={};
		}
	}
]);
