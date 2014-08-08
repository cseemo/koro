'use strict';

(function() {
	// Leads Controller Spec
	describe('Leads Controller Tests', function() {
		// Initialize global variables
		var LeadsController,
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

			// Initialize the Leads controller.
			LeadsController = $controller('LeadsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Lead object fetched from XHR', inject(function(Leads) {
			// Create sample Lead using the Leads service
			var sampleLead = new Leads({
				name: 'New Lead'
			});

			// Create a sample Leads array that includes the new Lead
			var sampleLeads = [sampleLead];

			// Set GET response
			$httpBackend.expectGET('leads').respond(sampleLeads);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.leads).toEqualData(sampleLeads);
		}));

		it('$scope.findOne() should create an array with one Lead object fetched from XHR using a leadId URL parameter', inject(function(Leads) {
			// Define a sample Lead object
			var sampleLead = new Leads({
				name: 'New Lead'
			});

			// Set the URL parameter
			$stateParams.leadId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/leads\/([0-9a-fA-F]{24})$/).respond(sampleLead);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.lead).toEqualData(sampleLead);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Leads) {
			// Create a sample Lead object
			var sampleLeadPostData = new Leads({
				name: 'New Lead'
			});

			// Create a sample Lead response
			var sampleLeadResponse = new Leads({
				_id: '525cf20451979dea2c000001',
				name: 'New Lead'
			});

			// Fixture mock form input values
			scope.name = 'New Lead';

			// Set POST response
			$httpBackend.expectPOST('leads', sampleLeadPostData).respond(sampleLeadResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Lead was created
			expect($location.path()).toBe('/leads/' + sampleLeadResponse._id);
		}));

		it('$scope.update() should update a valid Lead', inject(function(Leads) {
			// Define a sample Lead put data
			var sampleLeadPutData = new Leads({
				_id: '525cf20451979dea2c000001',
				name: 'New Lead'
			});

			// Mock Lead in scope
			scope.lead = sampleLeadPutData;

			// Set PUT response
			$httpBackend.expectPUT(/leads\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/leads/' + sampleLeadPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid leadId and remove the Lead from the scope', inject(function(Leads) {
			// Create new Lead object
			var sampleLead = new Leads({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Leads array and include the Lead
			scope.leads = [sampleLead];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/leads\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLead);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.leads.length).toBe(0);
		}));
	});
}());