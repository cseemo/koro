(function(){
  'use strict';

  angular.module('core').controller('AppController', ['$scope', '$rootScope', 
    function($scope, $rootScope) {

          $scope.main = {
            brand: 'GGN',
            name: 'Justin Bentley'
          };
          $scope.pageTransitionOpts = [
            {
              name: 'Scale up',
              'class': 'ainmate-scale-up'
            }, {
              name: 'Fade up',
              'class': 'animate-fade-up'
            }, {
              name: 'Slide in from right',
              'class': 'ainmate-slide-in-right'
            }, {
              name: 'Flip Y',
              'class': 'animate-flip-y'
            }
          ];
          $scope.admin = {
            layout: 'wide',
            menu: 'horizontal',
            fixedHeader: true,
            fixedSidebar: false,
            pageTransition: $scope.pageTransitionOpts[0]
          };
          $scope.$watch('admin', function(newVal, oldVal) {
            if (newVal.menu === 'horizontal' && oldVal.menu === 'vertical') {
              $rootScope.$broadcast('nav:reset');
              return;
            }
            if (newVal.fixedHeader === false && newVal.fixedSidebar === true) {
              if (oldVal.fixedHeader === false && oldVal.fixedSidebar === false) {
                $scope.admin.fixedHeader = true;
                $scope.admin.fixedSidebar = true;
              }
              if (oldVal.fixedHeader === true && oldVal.fixedSidebar === true) {
                $scope.admin.fixedHeader = false;
                $scope.admin.fixedSidebar = false;
              }
              return;
            }
            if (newVal.fixedSidebar === true) {
              $scope.admin.fixedHeader = true;
            }
            if (newVal.fixedHeader === false) {
              $scope.admin.fixedSidebar = false;
            }
          }, true);
          return ($scope.color = {
            primary: '#248AAF',
            success: '#3CBC8D',
            info: '#29B7D3',
            infoAlt: '#666699',
            warning: '#FAC552',
            danger: '#E9422E'
          });
    }
  ]).controller('HeaderCtrl', ['$scope', function($scope) {}]).
    controller('NavContainerCtrl', ['$scope', function($scope) {}]).
    controller('DashboardCtrl', ['$scope', 'Leads', function($scope, Leads) {

		$scope.myleads = 5;

		// Init our blank chart just to keep our settings in place
		//var plotChart1 = $.plot($('#leadschart'), [{}], {
		var pieChartOptions = {
			series: {
				pie: {
					show: true
				}
			},
			legend: {
				show: true
			},
			grid: {
				hoverable: true,
				clickable: true
			},
			colors: [$scope.color.primary, $scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger],
			tooltip: true,
			tooltipOpts: {
				content: "%p.0%, %s",
				defaultTheme: false
			}
		};
    	
    	// Grab our dataset from the RESTful API
    	$scope.LeadTotals = Leads.getLeadTotalsByStatus();

    	// Upon our promise being fulfiled convert our data and re-rener the chart
    	$scope.LeadTotals.$promise.then(function(){
    		console.log('like a boss!');
    		var data = [];
    		Object.keys($scope.LeadTotals).forEach(function(key) {
    			if($scope.LeadTotals[key]._id && $scope.LeadTotals[key]._id !== 'total') {
	    			data.push({label: $scope.LeadTotals[key]._id, data: $scope.LeadTotals[key].total});
	    		}
    		});
    		
    		// Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
    		var plotChart1 = $.plot($('#leadschart'), data, pieChartOptions);
    		// plotChart1.setData(data);
    		// plotChart1.setupGrid();
    		// plotChart1.draw();
    	});
   
$scope.getLead = function(){
$scope.myleads = 'working';

  console.log('Myscope',$scope);
};




    }]);
})();