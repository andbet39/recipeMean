'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Persone = mongoose.model('Persone'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, persone;

/**
 * Persone routes tests
 */
describe('Persone CRUD tests', function() {
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

		// Save a user to the test db and create new Persone
		user.save(function() {
			persone = {
				name: 'Persone Name'
			};

			done();
		});
	});

	it('should be able to save Persone instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Persone
				agent.post('/persones')
					.send(persone)
					.expect(200)
					.end(function(personeSaveErr, personeSaveRes) {
						// Handle Persone save error
						if (personeSaveErr) done(personeSaveErr);

						// Get a list of Persones
						agent.get('/persones')
							.end(function(personesGetErr, personesGetRes) {
								// Handle Persone save error
								if (personesGetErr) done(personesGetErr);

								// Get Persones list
								var persones = personesGetRes.body;

								// Set assertions
								(persones[0].user._id).should.equal(userId);
								(persones[0].name).should.match('Persone Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Persone instance if not logged in', function(done) {
		agent.post('/persones')
			.send(persone)
			.expect(401)
			.end(function(personeSaveErr, personeSaveRes) {
				// Call the assertion callback
				done(personeSaveErr);
			});
	});

	it('should not be able to save Persone instance if no name is provided', function(done) {
		// Invalidate name field
		persone.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Persone
				agent.post('/persones')
					.send(persone)
					.expect(400)
					.end(function(personeSaveErr, personeSaveRes) {
						// Set message assertion
						(personeSaveRes.body.message).should.match('Please fill Persone name');
						
						// Handle Persone save error
						done(personeSaveErr);
					});
			});
	});

	it('should be able to update Persone instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Persone
				agent.post('/persones')
					.send(persone)
					.expect(200)
					.end(function(personeSaveErr, personeSaveRes) {
						// Handle Persone save error
						if (personeSaveErr) done(personeSaveErr);

						// Update Persone name
						persone.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Persone
						agent.put('/persones/' + personeSaveRes.body._id)
							.send(persone)
							.expect(200)
							.end(function(personeUpdateErr, personeUpdateRes) {
								// Handle Persone update error
								if (personeUpdateErr) done(personeUpdateErr);

								// Set assertions
								(personeUpdateRes.body._id).should.equal(personeSaveRes.body._id);
								(personeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Persones if not signed in', function(done) {
		// Create new Persone model instance
		var personeObj = new Persone(persone);

		// Save the Persone
		personeObj.save(function() {
			// Request Persones
			request(app).get('/persones')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Persone if not signed in', function(done) {
		// Create new Persone model instance
		var personeObj = new Persone(persone);

		// Save the Persone
		personeObj.save(function() {
			request(app).get('/persones/' + personeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', persone.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Persone instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Persone
				agent.post('/persones')
					.send(persone)
					.expect(200)
					.end(function(personeSaveErr, personeSaveRes) {
						// Handle Persone save error
						if (personeSaveErr) done(personeSaveErr);

						// Delete existing Persone
						agent.delete('/persones/' + personeSaveRes.body._id)
							.send(persone)
							.expect(200)
							.end(function(personeDeleteErr, personeDeleteRes) {
								// Handle Persone error error
								if (personeDeleteErr) done(personeDeleteErr);

								// Set assertions
								(personeDeleteRes.body._id).should.equal(personeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Persone instance if not signed in', function(done) {
		// Set Persone user 
		persone.user = user;

		// Create new Persone model instance
		var personeObj = new Persone(persone);

		// Save the Persone
		personeObj.save(function() {
			// Try deleting Persone
			request(app).delete('/persones/' + personeObj._id)
			.expect(401)
			.end(function(personeDeleteErr, personeDeleteRes) {
				// Set message assertion
				(personeDeleteRes.body.message).should.match('User is not logged in');

				// Handle Persone error error
				done(personeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Persone.remove().exec();
		done();
	});
});