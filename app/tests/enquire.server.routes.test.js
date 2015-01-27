'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Enquire = mongoose.model('Enquire'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, enquire;

/**
 * Enquire routes tests
 */
describe('Enquire CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Enquire
		user.save(function() {
			enquire = {
				name: 'Enquire Name'
			};

			done();
		});
	});

	it('should be able to save Enquire instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Enquire
				agent.post('/enquires')
					.send(enquire)
					.expect(200)
					.end(function(enquireSaveErr, enquireSaveRes) {
						// Handle Enquire save error
						if (enquireSaveErr) done(enquireSaveErr);

						// Get a list of Enquires
						agent.get('/enquires')
							.end(function(enquiresGetErr, enquiresGetRes) {
								// Handle Enquire save error
								if (enquiresGetErr) done(enquiresGetErr);

								// Get Enquires list
								var enquires = enquiresGetRes.body;

								// Set assertions
								(enquires[0].user._id).should.equal(userId);
								(enquires[0].name).should.match('Enquire Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Enquire instance if not logged in', function(done) {
		agent.post('/enquires')
			.send(enquire)
			.expect(401)
			.end(function(enquireSaveErr, enquireSaveRes) {
				// Call the assertion callback
				done(enquireSaveErr);
			});
	});

	it('should not be able to save Enquire instance if no name is provided', function(done) {
		// Invalidate name field
		enquire.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Enquire
				agent.post('/enquires')
					.send(enquire)
					.expect(400)
					.end(function(enquireSaveErr, enquireSaveRes) {
						// Set message assertion
						(enquireSaveRes.body.message).should.match('Please fill Enquire name');
						
						// Handle Enquire save error
						done(enquireSaveErr);
					});
			});
	});

	it('should be able to update Enquire instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Enquire
				agent.post('/enquires')
					.send(enquire)
					.expect(200)
					.end(function(enquireSaveErr, enquireSaveRes) {
						// Handle Enquire save error
						if (enquireSaveErr) done(enquireSaveErr);

						// Update Enquire name
						enquire.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Enquire
						agent.put('/enquires/' + enquireSaveRes.body._id)
							.send(enquire)
							.expect(200)
							.end(function(enquireUpdateErr, enquireUpdateRes) {
								// Handle Enquire update error
								if (enquireUpdateErr) done(enquireUpdateErr);

								// Set assertions
								(enquireUpdateRes.body._id).should.equal(enquireSaveRes.body._id);
								(enquireUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Enquires if not signed in', function(done) {
		// Create new Enquire model instance
		var enquireObj = new Enquire(enquire);

		// Save the Enquire
		enquireObj.save(function() {
			// Request Enquires
			request(app).get('/enquires')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Enquire if not signed in', function(done) {
		// Create new Enquire model instance
		var enquireObj = new Enquire(enquire);

		// Save the Enquire
		enquireObj.save(function() {
			request(app).get('/enquires/' + enquireObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', enquire.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Enquire instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Enquire
				agent.post('/enquires')
					.send(enquire)
					.expect(200)
					.end(function(enquireSaveErr, enquireSaveRes) {
						// Handle Enquire save error
						if (enquireSaveErr) done(enquireSaveErr);

						// Delete existing Enquire
						agent.delete('/enquires/' + enquireSaveRes.body._id)
							.send(enquire)
							.expect(200)
							.end(function(enquireDeleteErr, enquireDeleteRes) {
								// Handle Enquire error error
								if (enquireDeleteErr) done(enquireDeleteErr);

								// Set assertions
								(enquireDeleteRes.body._id).should.equal(enquireSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Enquire instance if not signed in', function(done) {
		// Set Enquire user 
		enquire.user = user;

		// Create new Enquire model instance
		var enquireObj = new Enquire(enquire);

		// Save the Enquire
		enquireObj.save(function() {
			// Try deleting Enquire
			request(app).delete('/enquires/' + enquireObj._id)
			.expect(401)
			.end(function(enquireDeleteErr, enquireDeleteRes) {
				// Set message assertion
				(enquireDeleteRes.body.message).should.match('User is not logged in');

				// Handle Enquire error error
				done(enquireDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Enquire.remove().exec();
		done();
	});
});