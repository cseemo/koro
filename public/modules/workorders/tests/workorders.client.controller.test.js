'use strict';

(function() {
	// Workorders Controller Spec
	describe('Workorders Controller Tests', function() {
		// Initialize global variables
		var WorkordersController,
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

			// Initialize the Workorders controller.
			WorkordersController = $controller('WorkordersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Workorder object fetched from XHR', inject(function(Workorders) {
			// Create sample Workorder using the Workorders service
			var sampleWorkorder = new Workorders({
				name: 'New Workorder'
			});

			// Create a sample Workorders array that includes the new Workorder
			var sampleWorkorders = [sampleWorkorder];

			// Set GET response
			$httpBackend.expectGET('workorders').respond(sampleWorkorders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workorders).toEqualData(sampleWorkorders);
		}));

		it('$scope.findOne() should create an array with one Workorder object fetched from XHR using a workorderId URL parameter', inject(function(Workorders) {
			// Define a sample Workorder object
			var sampleWorkorder = new Workorders({
				name: 'New Workorder'
			});

			// Set the URL parameter
			$stateParams.workorderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/workorders\/([0-9a-fA-F]{24})$/).respond(sampleWorkorder);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.workorder).toEqualData(sampleWorkorder);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Workorders) {
			// Create a sample Workorder object
			var sampleWorkorderPostData = new Workorders({
				name: 'New Workorder'
			});

			// Create a sample Workorder response
			var sampleWorkorderResponse = new Workorders({
				_id: '525cf20451979dea2c000001',
				name: 'New Workorder'
			});

			// Fixture mock form input values
			scope.name = 'New Workorder';

			// Set POST response
			$httpBackend.expectPOST('workorders', sampleWorkorderPostData).respond(sampleWorkorderResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Workorder was created
			expect($location.path()).toBe('/workorders/' + sampleWorkorderResponse._id);
		}));

		it('$scope.update() should update a valid Workorder', inject(function(Workorders) {
			// Define a sample Workorder put data
			var sampleWorkorderPutData = new Workorders({
				_id: '525cf20451979dea2c000001',
				name: 'New Workorder'
			});

			// Mock Workorder in scope
			scope.workorder = sampleWorkorderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/workorders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/workorders/' + sampleWorkorderPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid workorderId and remove the Workorder from the scope', inject(function(Workorders) {
			// Create new Workorder object
			var sampleWorkorder = new Workorders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Workorders array and include the Workorder
			scope.workorders = [sampleWorkorder];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/workorders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWorkorder);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.workorders.length).toBe(0);
		}));
	});
}());