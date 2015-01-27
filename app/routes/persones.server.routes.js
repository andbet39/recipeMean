'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var persones = require('../../app/controllers/persones.server.controller');

	// Persones Routes
	app.route('/persones')
		.get(persones.list)
		.post(users.requiresLogin, persones.create);

	app.route('/persones/:personeId')
		.get(persones.read)
		.put(users.requiresLogin, persones.hasAuthorization, persones.update)
		.delete(users.requiresLogin, persones.hasAuthorization, persones.delete);

	// Finish by binding the Persone middleware
	app.param('personeId', persones.personeByID);
};
