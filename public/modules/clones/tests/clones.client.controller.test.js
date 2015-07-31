'use strict';

(function() {
	// Clones Controller Spec
	describe('Clones Controller Tests', function() {
		// Initialize global variables
		var ClonesController,
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

			// Initialize the Clones controller.
			ClonesController = $controller('ClonesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Clone object fetched from XHR', inject(function(Clones) {
			// Create sample Clone using the Clones service
			var sampleClone = new Clones({
				name: 'New Clone'
			});

			// Create a sample Clones array that includes the new Clone
			var sampleClones = [sampleClone];

			// Set GET response
			$httpBackend.expectGET('clones').respond(sampleClones);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clones).toEqualData(sampleClones);
		}));

		it('$scope.findOne() should create an array with one Clone object fetched from XHR using a cloneId URL parameter', inject(function(Clones) {
			// Define a sample Clone object
			var sampleClone = new Clones({
				name: 'New Clone'
			});

			// Set the URL parameter
			$stateParams.cloneId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/clones\/([0-9a-fA-F]{24})$/).respond(sampleClone);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.clone).toEqualData(sampleClone);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Clones) {
			// Create a sample Clone object
			var sampleClonePostData = new Clones({
				name: 'New Clone'
			});

			// Create a sample Clone response
			var sampleCloneResponse = new Clones({
				_id: '525cf20451979dea2c000001',
				name: 'New Clone'
			});

			// Fixture mock form input values
			scope.name = 'New Clone';

			// Set POST response
			$httpBackend.expectPOST('clones', sampleClonePostData).respond(sampleCloneResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Clone was created
			expect($location.path()).toBe('/clones/' + sampleCloneResponse._id);
		}));

		it('$scope.update() should update a valid Clone', inject(function(Clones) {
			// Define a sample Clone put data
			var sampleClonePutData = new Clones({
				_id: '525cf20451979dea2c000001',
				name: 'New Clone'
			});

			// Mock Clone in scope
			scope.clone = sampleClonePutData;

			// Set PUT response
			$httpBackend.expectPUT(/clones\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/clones/' + sampleClonePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid cloneId and remove the Clone from the scope', inject(function(Clones) {
			// Create new Clone object
			var sampleClone = new Clones({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Clones array and include the Clone
			scope.clones = [sampleClone];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/clones\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleClone);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.clones.length).toBe(0);
		}));
	});
}());