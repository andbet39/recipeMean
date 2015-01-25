'use strict';

angular.module('chat').factory('Chat', ['$firebase',
	function($firebase) {
		var ref = new Firebase('https://luminous-heat-165.firebaseio.com');
		var messages = $firebase(ref.child('messages')).$asArray();

		var Message = {
			all: messages,
			create: function (message) {
				return messages.$add(message);
			},
			get: function (messageId) {
				return $firebase(ref.child('messages').child(messageId)).$asObject();
			},
			delete: function (message) {
				return messages.$remove(message);
			}
		};

		return Message;

	}
]);
