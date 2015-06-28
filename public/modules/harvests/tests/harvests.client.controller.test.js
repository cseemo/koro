'use strict';

(function() {
	// Harvests Controller Spec
	describe('Harvests Controller Tests', function() {
		// Initialize global variables
		var HarvestsController,
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

			// Initialize the Harvests controller.
			HarvestsController = $controller('HarvestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Harvest object fetched from XHR', inject(function(Harvests) {
			// Create sample Harvest using the Harvests service
			var sampleHarvest = new Harvests({
				name: 'New Harvest'
			});

			// Create a sample Harvests array that includes the new Harvest
			var sampleHarvests = [sampleHarvest];

			// Set GET response
			$httpBackend.expectGET('harvests').respond(sampleHarvests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.harvests).toEqualData(sampleHarvests);
		}));

		it('$scope.findOne() should create an array with one Harvest object fetched from XHR using a harvestId URL parameter', inject(function(Harvests) {
			// Define a sample Harvest object
			var sampleHarvest = new Harvests({
				name: 'New Harvest'
			});

			// Set the URL parameter
			$stateParams.harvestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/harvests\/([0-9a-fA-F]{24})$/).respond(sampleHarvest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.harvest).toEqualData(sampleHarvest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Harvests) {
			// Create a sample Harvest object
			var sampleHarvestPostData = new Harvests({
				name: 'New Harvest'
			});

			// Create a sample Harvest response
			var sampleHarvestResponse = new Harvests({
				_id: '525cf20451979dea2c000001',
				name: 'New Harvest'
			});

			// Fixture mock form input values
			scope.name = 'New Harvest';

			// Set POST response
			$httpBackend.expectPOST('harvests', sampleHarvestPostData).respond(sampleHarvestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Harvest was created
			expect($location.path()).toBe('/harvests/' + sampleHarvestResponse._id);
		}));

		it('$scope.update() should update a valid Harvest', inject(function(Harvests) {
			// Define a sample Harvest put data
			var sampleHarvestPutData = new Harvests({
				_id: '525cf20451979dea2c000001',
				name: 'New Harvest'
			});

			// Mock Harvest in scope
			scope.harvest = sampleHarvestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/harvests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/harvests/' + sampleHarvestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid harvestId and remove the Harvest from the scope', inject(function(Harvests) {
			// Create new Harvest object
			var sampleHarvest = new Harvests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Harvests array and include the Harvest
			scope.harvests = [sampleHarvest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/harvests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleHarvest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.harvests.length).toBe(0);
		}));
	});
}());