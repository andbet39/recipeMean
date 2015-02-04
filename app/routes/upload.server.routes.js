'use strict';

module.exports = function(app) {
		var upload  = require('../../app/controllers/upload.server.controller');
		var multer  = require('multer');

	app.use(multer({ dest: '/upload'}));


	app.route('/upload')
		.post(upload.create)
		.get(upload.read);
	};