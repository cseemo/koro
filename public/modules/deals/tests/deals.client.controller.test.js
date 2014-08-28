'use strict';

(function() {
	// Deals Controller Spec
	describe('Deals Controller Tests', function() {
		// Initialize global variables
		var DealsController,
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

			// Initialize the Deals controller.
			DealsController = $controller('DealsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Deal object fetched from XHR', inject(function(Deals) {
			// Create sample Deal using the Deals service
			var sampleDeal = new Deals({
				name: 'New Deal'
			});

			// Create a sample Deals array that includes the new Deal
			var sampleDeals = [sampleDeal];

			// Set GET response
			$httpBackend.expectGET('deals').respond(sampleDeals);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.deals).toEqualData(sampleDeals);
		}));

		it('$scope.findOne() should create an array with one Deal object fetched from XHR using a dealId URL parameter', inject(function(Deals) {
			// Define a sample Deal object
			var sampleDeal = new Deals({
				name: 'New Deal'
			});

			// Set the URL parameter
			$stateParams.dealId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/deals\/([0-9a-fA-F]{24})$/).respond(sampleDeal);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.deal).toEqualData(sampleDeal);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Deals) {
			// Create a sample Deal object
			var sampleDealPostData = new Deals({
				name: 'New Deal'
			});

			// Create a sample Deal response
			var sampleDealResponse = new Deals({
				_id: '525cf20451979dea2c000001',
				name: 'New Deal'
			});

			// Fixture mock form input values
			scope.name = 'New Deal';

			// Set POST response
			$httpBackend.expectPOST('deals', sampleDealPostData).respond(sampleDealResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Deal was created
			expect($location.path()).toBe('/deals/' + sampleDealResponse._id);
		}));

		it('$scope.update() should update a valid Deal', inject(function(Deals) {
			// Define a sample Deal put data
			var sampleDealPutData = new Deals({
				_id: '525cf20451979dea2c000001',
				name: 'New Deal'
			});

			// Mock Deal in scope
			scope.deal = sampleDealPutData;

			// Set PUT response
			$httpBackend.expectPUT(/deals\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/deals/' + sampleDealPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid dealId and remove the Deal from the scope', inject(function(Deals) {
			// Create new Deal object
			var sampleDeal = new Deals({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Deals array and include the Deal
			scope.deals = [sampleDeal];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/deals\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDeal);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.deals.length).toBe(0);
		}));
	});
}());