'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var enquires = require('../../app/controllers/enquires.server.controller');

	// Enquires Routes
	app.route('/enquires')
		.get(enquires.list)
		.post(users.requiresLogin, enquires.create);

	app.route('/enquires/:enquireId')
		.get(enquires.read)
		.put(users.requiresLogin, enquires.hasAuthorization, enquires.update)
		.delete(users.requiresLogin, enquires.hasAuthorization, enquires.delete);
	
	app.route('/enquires/addVisit/:enquireId')
		.get(enquires.increseVisitCounter);

	// Finish by binding the Enquire middleware
	app.param('enquireId', enquires.enquireByID);
};
