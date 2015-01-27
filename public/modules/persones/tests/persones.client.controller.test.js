'use strict';

(function() {
	// Persones Controller Spec
	describe('Persones Controller Tests', function() {
		// Initialize global variables
		var PersonesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Persones controller.
			PersonesController = $controller('PersonesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Persone object fetched from XHR', inject(function(Persones) {
			// Create sample Persone using the Persones service
			var samplePersone = new Persones({
				name: 'New Persone'
			});

			// Create a sample Persones array that includes the new Persone
			var samplePersones = [samplePersone];

			// Set GET response
			$httpBackend.expectGET('persones').respond(samplePersones);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.persones).toEqualData(samplePersones);
		}));

		it('$scope.findOne() should create an array with one Persone object fetched from XHR using a personeId URL parameter', inject(function(Persones) {
			// Define a sample Persone object
			var samplePersone = new Persones({
				name: 'New Persone'
			});

			// Set the URL parameter
			$stateParams.personeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/persones\/([0-9a-fA-F]{24})$/).respond(samplePersone);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.persone).toEqualData(samplePersone);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Persones) {
			// Create a sample Persone object
			var samplePersonePostData = new Persones({
				name: 'New Persone'
			});

			// Create a sample Persone response
			var samplePersoneResponse = new Persones({
				_id: '525cf20451979dea2c000001',
				name: 'New Persone'
			});

			// Fixture mock form input values
			scope.name = 'New Persone';

			// Set POST response
			$httpBackend.expectPOST('persones', samplePersonePostData).respond(samplePersoneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Persone was created
			expect($location.path()).toBe('/persones/' + samplePersoneResponse._id);
		}));

		it('$scope.update() should update a valid Persone', inject(function(Persones) {
			// Define a sample Persone put data
			var samplePersonePutData = new Persones({
				_id: '525cf20451979dea2c000001',
				name: 'New Persone'
			});

			// Mock Persone in scope
			scope.persone = samplePersonePutData;

			// Set PUT response
			$httpBackend.expectPUT(/persones\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/persones/' + samplePersonePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid personeId and remove the Persone from the scope', inject(function(Persones) {
			// Create new Persone object
			var samplePersone = new Persones({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Persones array and include the Persone
			scope.persones = [samplePersone];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/persones\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePersone);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.persones.length).toBe(0);
		}));
	});
}());