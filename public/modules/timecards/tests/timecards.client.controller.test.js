'use strict';

(function() {
	// Timecards Controller Spec
	describe('Timecards Controller Tests', function() {
		// Initialize global variables
		var TimecardsController,
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

			// Initialize the Timecards controller.
			TimecardsController = $controller('TimecardsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Timecard object fetched from XHR', inject(function(Timecards) {
			// Create sample Timecard using the Timecards service
			var sampleTimecard = new Timecards({
				name: 'New Timecard'
			});

			// Create a sample Timecards array that includes the new Timecard
			var sampleTimecards = [sampleTimecard];

			// Set GET response
			$httpBackend.expectGET('timecards').respond(sampleTimecards);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timecards).toEqualData(sampleTimecards);
		}));

		it('$scope.findOne() should create an array with one Timecard object fetched from XHR using a timecardId URL parameter', inject(function(Timecards) {
			// Define a sample Timecard object
			var sampleTimecard = new Timecards({
				name: 'New Timecard'
			});

			// Set the URL parameter
			$stateParams.timecardId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/timecards\/([0-9a-fA-F]{24})$/).respond(sampleTimecard);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.timecard).toEqualData(sampleTimecard);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Timecards) {
			// Create a sample Timecard object
			var sampleTimecardPostData = new Timecards({
				name: 'New Timecard'
			});

			// Create a sample Timecard response
			var sampleTimecardResponse = new Timecards({
				_id: '525cf20451979dea2c000001',
				name: 'New Timecard'
			});

			// Fixture mock form input values
			scope.name = 'New Timecard';

			// Set POST response
			$httpBackend.expectPOST('timecards', sampleTimecardPostData).respond(sampleTimecardResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Timecard was created
			expect($location.path()).toBe('/timecards/' + sampleTimecardResponse._id);
		}));

		it('$scope.update() should update a valid Timecard', inject(function(Timecards) {
			// Define a sample Timecard put data
			var sampleTimecardPutData = new Timecards({
				_id: '525cf20451979dea2c000001',
				name: 'New Timecard'
			});

			// Mock Timecard in scope
			scope.timecard = sampleTimecardPutData;

			// Set PUT response
			$httpBackend.expectPUT(/timecards\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/timecards/' + sampleTimecardPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid timecardId and remove the Timecard from the scope', inject(function(Timecards) {
			// Create new Timecard object
			var sampleTimecard = new Timecards({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Timecards array and include the Timecard
			scope.timecards = [sampleTimecard];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/timecards\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTimecard);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.timecards.length).toBe(0);
		}));
	});
}());