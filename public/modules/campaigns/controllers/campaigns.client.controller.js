'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Campaigns',
	function($scope, $stateParams, $location, Authentication, Campaigns ) {
		$scope.authentication = Authentication;

		//States Array
		$scope.statesCTL = [{
			state: 'AZ'
		},
		{
			state: 'CO'
		},
		{
			state: 'IA'
		},
		{
			state: 'ID'
		},		
		{
			state: 'MN'
		},		
		{
			state: 'MT'
		},		
		{
			state: 'ND'
		},		
		{
			state: 'NE'
		},		
		{
			state: 'NM'
		},		
		{
			state: 'OR'
		},		
		{
			state: 'SD'
		},		
		{
			state: 'UT'
		},		
		{
			state: 'WA'
		},		
		{
			state: 'WY'
		}

		];

		$scope.carriers = [{

			name: 'Charter'
		},
		{
			name: 'McleodUSA'
		},
		{
			name: 'Comcast'
		},
		{
			name: 'Eschelon'
		},
		{
			name: 'Electric Lightwave'
		},
		{
			name: 'TW Telecom'
		},
		{
			name: 'Cox'
		}];





		// Create new Campaign
		$scope.create = function() {
			// Create new Campaign object
			console.log('this %o', this);
			var campstates = [];


			// Go through each state and if it is set to true add it to our array
			for(var i in this.statesCTL) {
				console.log('This bes: ',this.statesCTL[i]);
				if(this.statesCTL[i].$index){
					console.log('This state is true!');
					campstates.push(this.statesCTL[i].state);
					
				}
				}
				console.log('These states are included:',campstates);
				console.log('States length',campstates.length);
				if(campstates.length>0){
					//campstates = $scope.statesCTL;
					var campaign = new Campaigns ({
				name: this.name,
				states: campstates
			});
				}else{
						var campaign = new Campaigns ({
				name: this.name
				
			});
				}
			

			// Redirect after save
			campaign.$save(function(response) {
				$location.path('campaigns/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Campaign
		$scope.remove = function( campaign ) {
			if ( campaign ) { campaign.$remove();

				for (var i in $scope.campaigns ) {
					if ($scope.campaigns [i] === campaign ) {
						$scope.campaigns.splice(i, 1);
					}
				}
			} else {
				$scope.campaign.$remove(function() {
					$location.path('campaigns');
				});
			}
		};

		// Update existing Campaign
		$scope.update = function() {
			var campaign = $scope.campaign ;

			campaign.$update(function() {
				$location.path('campaigns/' + campaign._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Campaigns
		$scope.find = function() {
			$scope.campaigns = Campaigns.query();
		};

		// Find existing Campaign
		$scope.findOne = function() {
			$scope.campaign = Campaigns.get({ 
				campaignId: $stateParams.campaignId
			});
		};
	}
]);