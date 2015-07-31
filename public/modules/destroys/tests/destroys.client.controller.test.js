'use strict';

(function() {
	// Destroys Controller Spec
	describe('Destroys Controller Tests', function() {
		// Initialize global variables
		var DestroysController,
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

			// Initialize the Destroys controller.
			DestroysController = $controller('DestroysController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Destroy object fetched from XHR', inject(function(Destroys) {
			// Create sample Destroy using the Destroys service
			var sampleDestroy = new Destroys({
				name: 'New Destroy'
			});

			// Create a sample Destroys array that includes the new Destroy
			var sampleDestroys = [sampleDestroy];

			// Set GET response
			$httpBackend.expectGET('destroys').respond(sampleDestroys);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.destroys).toEqualData(sampleDestroys);
		}));

		it('$scope.findOne() should create an array with one Destroy object fetched from XHR using a destroyId URL parameter', inject(function(Destroys) {
			// Define a sample Destroy object
			var sampleDestroy = new Destroys({
				name: 'New Destroy'
			});

			// Set the URL parameter
			$stateParams.destroyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/destroys\/([0-9a-fA-F]{24})$/).respond(sampleDestroy);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.destroy).toEqualData(sampleDestroy);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Destroys) {
			// Create a sample Destroy object
			var sampleDestroyPostData = new Destroys({
				name: 'New Destroy'
			});

			// Create a sample Destroy response
			var sampleDestroyResponse = new Destroys({
				_id: '525cf20451979dea2c000001',
				name: 'New Destroy'
			});

			// Fixture mock form input values
			scope.name = 'New Destroy';

			// Set POST response
			$httpBackend.expectPOST('destroys', sampleDestroyPostData).respond(sampleDestroyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Destroy was created
			expect($location.path()).toBe('/destroys/' + sampleDestroyResponse._id);
		}));

		it('$scope.update() should update a valid Destroy', inject(function(Destroys) {
			// Define a sample Destroy put data
			var sampleDestroyPutData = new Destroys({
				_id: '525cf20451979dea2c000001',
				name: 'New Destroy'
			});

			// Mock Destroy in scope
			scope.destroy = sampleDestroyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/destroys\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/destroys/' + sampleDestroyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid destroyId and remove the Destroy from the scope', inject(function(Destroys) {
			// Create new Destroy object
			var sampleDestroy = new Destroys({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Destroys array and include the Destroy
			scope.destroys = [sampleDestroy];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/destroys\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDestroy);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.destroys.length).toBe(0);
		}));
	});
}());