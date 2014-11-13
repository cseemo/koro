'use strict';

(function() {
	// Offenders Controller Spec
	describe('Offenders Controller Tests', function() {
		// Initialize global variables
		var OffendersController,
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

			// Initialize the Offenders controller.
			OffendersController = $controller('OffendersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Offender object fetched from XHR', inject(function(Offenders) {
			// Create sample Offender using the Offenders service
			var sampleOffender = new Offenders({
				name: 'New Offender'
			});

			// Create a sample Offenders array that includes the new Offender
			var sampleOffenders = [sampleOffender];

			// Set GET response
			$httpBackend.expectGET('offenders').respond(sampleOffenders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.offenders).toEqualData(sampleOffenders);
		}));

		it('$scope.findOne() should create an array with one Offender object fetched from XHR using a offenderId URL parameter', inject(function(Offenders) {
			// Define a sample Offender object
			var sampleOffender = new Offenders({
				name: 'New Offender'
			});

			// Set the URL parameter
			$stateParams.offenderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/offenders\/([0-9a-fA-F]{24})$/).respond(sampleOffender);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.offender).toEqualData(sampleOffender);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Offenders) {
			// Create a sample Offender object
			var sampleOffenderPostData = new Offenders({
				name: 'New Offender'
			});

			// Create a sample Offender response
			var sampleOffenderResponse = new Offenders({
				_id: '525cf20451979dea2c000001',
				name: 'New Offender'
			});

			// Fixture mock form input values
			scope.name = 'New Offender';

			// Set POST response
			$httpBackend.expectPOST('offenders', sampleOffenderPostData).respond(sampleOffenderResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Offender was created
			expect($location.path()).toBe('/offenders/' + sampleOffenderResponse._id);
		}));

		it('$scope.update() should update a valid Offender', inject(function(Offenders) {
			// Define a sample Offender put data
			var sampleOffenderPutData = new Offenders({
				_id: '525cf20451979dea2c000001',
				name: 'New Offender'
			});

			// Mock Offender in scope
			scope.offender = sampleOffenderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/offenders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/offenders/' + sampleOffenderPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid offenderId and remove the Offender from the scope', inject(function(Offenders) {
			// Create new Offender object
			var sampleOffender = new Offenders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Offenders array and include the Offender
			scope.offenders = [sampleOffender];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/offenders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleOffender);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.offenders.length).toBe(0);
		}));
	});
}());