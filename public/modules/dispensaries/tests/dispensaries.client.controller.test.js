'use strict';

(function() {
	// Dispensaries Controller Spec
	describe('Dispensaries Controller Tests', function() {
		// Initialize global variables
		var DispensariesController,
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

			// Initialize the Dispensaries controller.
			DispensariesController = $controller('DispensariesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dispensary object fetched from XHR', inject(function(Dispensaries) {
			// Create sample Dispensary using the Dispensaries service
			var sampleDispensary = new Dispensaries({
				name: 'New Dispensary'
			});

			// Create a sample Dispensaries array that includes the new Dispensary
			var sampleDispensaries = [sampleDispensary];

			// Set GET response
			$httpBackend.expectGET('dispensaries').respond(sampleDispensaries);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dispensaries).toEqualData(sampleDispensaries);
		}));

		it('$scope.findOne() should create an array with one Dispensary object fetched from XHR using a dispensaryId URL parameter', inject(function(Dispensaries) {
			// Define a sample Dispensary object
			var sampleDispensary = new Dispensaries({
				name: 'New Dispensary'
			});

			// Set the URL parameter
			$stateParams.dispensaryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/dispensaries\/([0-9a-fA-F]{24})$/).respond(sampleDispensary);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dispensary).toEqualData(sampleDispensary);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Dispensaries) {
			// Create a sample Dispensary object
			var sampleDispensaryPostData = new Dispensaries({
				name: 'New Dispensary'
			});

			// Create a sample Dispensary response
			var sampleDispensaryResponse = new Dispensaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Dispensary'
			});

			// Fixture mock form input values
			scope.name = 'New Dispensary';

			// Set POST response
			$httpBackend.expectPOST('dispensaries', sampleDispensaryPostData).respond(sampleDispensaryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dispensary was created
			expect($location.path()).toBe('/dispensaries/' + sampleDispensaryResponse._id);
		}));

		it('$scope.update() should update a valid Dispensary', inject(function(Dispensaries) {
			// Define a sample Dispensary put data
			var sampleDispensaryPutData = new Dispensaries({
				_id: '525cf20451979dea2c000001',
				name: 'New Dispensary'
			});

			// Mock Dispensary in scope
			scope.dispensary = sampleDispensaryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/dispensaries\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/dispensaries/' + sampleDispensaryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dispensaryId and remove the Dispensary from the scope', inject(function(Dispensaries) {
			// Create new Dispensary object
			var sampleDispensary = new Dispensaries({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Dispensaries array and include the Dispensary
			scope.dispensaries = [sampleDispensary];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/dispensaries\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDispensary);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.dispensaries.length).toBe(0);
		}));
	});
}());