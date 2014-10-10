(function(){
  'use strict';

  angular.module('core').controller('AppController', ['$scope', '$rootScope',
    function($scope, $rootScope) {

          $scope.main = {
            brand: "Five C's Consulting",
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
            secondary: '#3CBC8D',
            success: '#3CBC8D',
            info: '#29B7D3',
            infoAlt: '#666699',
            warning: '#FAC552',
            danger: '#E9422E',
            chad: '#666699'
          });



   $scope.authentication = Authentication;
  //If a socket call comes for this user Fire off a toastr event
    socket.on($scope.authentication.user._id, function(data) {
        console.log('Socket Data for specific user : %o', $scope.authentication.user);
        toastr.info(data.deal+' just signed their LOAs!!');     
        });
    }
  ])
        
    


        .controller('NavContainerCtrl', ['$scope', function($scope) {}]).
    controller('DashboardCtrl', ['$scope', 'Authentication', 'Leads', 'Deals', '$filter', 'socket', '$timeout', function($scope, Authentication, Leads, Deals, $filter, socket, $timeout) {
   
      
             socket.on('newconnect', function(data) {
        //console.log('Socket Data: %o', data);
        $scope.myObject = data;
      });

      var newdata;

        //   socket.on('test', function(data) {
        // //console.log('Socket On Test', data);
        
        // });

        // // socket.on('connection', function(data) {
        // // ////console.log('Connected', data);
        // // $scope.myObject = data;
        // // //window.alert('What up -- some one conected');
        // });
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
        content: '%p.0%, %s',
        defaultTheme: false
      }
    };
      
      // Grab our dataset from the RESTful API
      $scope.LeadTotals = Leads.getLeadTotalsByStatus();
      $scope.AllLeadTotals = Leads.getAllLeadTotalsByStatus();
        $scope.LeadStateTotals = Leads.getLeadsByState();
        $scope.LeadCarrierTotals = Leads.getLeadTotalsByCarrier();
        $scope.AllLeadsbyState = Leads.getLeadTotalsByState();


          //Pie Chart of Lead Breakdown by State
    // Upon our promise being fulfiled convert our data and re-rener the chart
      $scope.LeadStateTotals.$promise.then(function(){
        //////console.log('like a boss!');
        var data = [];
        Object.keys($scope.LeadStateTotals).forEach(function(key) {
          if($scope.LeadStateTotals[key]._id && $scope.LeadStateTotals[key]._id !== 'total') {
            data.push({label: $scope.LeadStateTotals[key]._id, data: $scope.LeadStateTotals[key].total});
            //////console.log('Total: ', $scope.LeadStateTotals[key]._id + ' ' + $scope.LeadStateTotals[key].total);
          }


        });
        
        // Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
        var plotChart2 = $.plot($('#leadsStatechart'), data, pieChartOptions);
        // plotChart1.setData(data);
        // plotChart1.setupGrid();
        // plotChart1.draw();
      });

       $scope.AllLeadsbyState.$promise.then(function(){
        ////console.log('like a boss!');
        var data = [];
        Object.keys($scope.LeadStateTotals).forEach(function(key) {
          if($scope.LeadStateTotals[key]._id && $scope.LeadStateTotals[key]._id !== 'total') {
            data.push({label: $scope.LeadStateTotals[key]._id, data: $scope.LeadStateTotals[key].total});
            ////console.log('Total: ', $scope.LeadStateTotals[key]._id + ' ' + $scope.LeadStateTotals[key].total);
          }


        });
        
        // Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
        var plotChart2 = $.plot($('#ALLleadsStatechart'), data, pieChartOptions);
        // plotChart1.setData(data);
        // plotChart1.setupGrid();
        // plotChart1.draw();
      });


       //Leads By Status for REP
      $scope.LeadTotals.$promise.then(function(){
        //////console.log('like a boss!');
        var data = [];
        Object.keys($scope.LeadTotals).forEach(function(key) {
          if($scope.LeadTotals[key]._id && $scope.LeadTotals[key]._id !== 'total') {
            data.push({label: $scope.LeadTotals[key]._id, data: $scope.LeadTotals[key].total});
            ////console.log('Total: ', $scope.LeadTotals[key]._id + ' ' + $scope.LeadTotals[key].total);
          }
          if($scope.LeadTotals[key]._id === 'total'){
            //Marin had double == JSLint suggested ===
          //Fill out box of Total Leads
               $scope.myleads = $scope.LeadTotals[key].total;
               ////console.log('Chads tingy: ', $scope.LeadTotals[key].total);
          }

        });
        
        // Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
        var plotChart1 = $.plot($('#leadschart'), data, pieChartOptions);
        // plotChart1.setData(data);
        // plotChart1.setupGrid();
        // plotChart1.draw();
      });


      //LEADS by Status for ADMIND
      $scope.AllLeadTotals.$promise.then(function(){
        //console.log('like a boss! -- ALL LEAD TOTALS');
        var data = [];
        Object.keys($scope.AllLeadTotals).forEach(function(key) {
          if($scope.AllLeadTotals[key]._id && $scope.AllLeadTotals[key]._id !== 'total') {
            data.push({label: $scope.AllLeadTotals[key]._id, data: $scope.AllLeadTotals[key].total});
            //console.log('Total: ', $scope.AllLeadTotals[key]._id + ' ' + $scope.AllLeadTotals[key].total);
          }
          if($scope.AllLeadTotals[key]._id === 'total'){
            //Marin had double == JSLint suggested ===
          //Fill out box of Total Leads
               $scope.myleads = $scope.AllLeadTotals[key].total;
               ////console.log('Chads tingy: ', $scope.LeadTotals[key].total);
          }

        });
            // Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
        //#####var plotChart1 = $.plot($('#ALLleadschart'), data, pieChartOptions);
        $scope.leadsChart = {
          data: data,
          options: pieChartOptions
        };
        // plotChart1.setData(data);
        // plotChart1.setupGrid();
        // plotChart1.draw();
      });

        //Get Total MRC
      //    $scope.mrcTotal = Leads.getRevenueSold();
      //   //$scope.usermrcTotal = Leads.getRevenueSold();
      //   //$scope.totmrcTotal = Leads.getRevenueSold();

      //   $scope.mrcTotal.$promise.then(function(){
      //   ////console.log('This user has how many roles? ', $scope.user.roles.length);
      //   var data = [];
      //   Object.keys($scope.mrcTotal).forEach(function(key) {
      //     if($scope.mrcTotal[key]._id && $scope.mrcTotal[key]._id !== 'total') {
      //       data.push({label: $scope.mrcTotal[key]._id, data: $scope.mrcTotal[key].total});
      //       //////console.log('Total: ', $scope.mrcTotal[key]._id + ' ' + $scope.mrcTotal[key].total);
      //     }
      //     if($scope.mrcTotal[key]._id === 'total'){
      //     //Fill out box of Total Leads
      //          $scope.mrcTotal = $scope.mrcTotal[key].total;
      //          //////console.log('Chads tingy: ', $scope.mrcTotal[key].total);
      //     }


      //   });
      //   //Semi colon above suggested by JSLint marin didn't have one

      // });



         $scope.mycallDetails = Leads.getCallsbyRep();

        $scope.mycallDetails.$promise.then(function(results){
          $scope.mycallDetails = 0;
        ////console.log('Get call Details %o', results);
        Object.keys(results).forEach(function(key) {

          ////console.log('Results Key %o', results[key]);
          ////console.log(Authentication.user.displayName);
          //Converted == to === JSLint
          if(results[key]._id===Authentication.user.displayName)
          {
            $scope.mycallDetails = results[key].total;
            ////console.log('WE WON, JOHNNY WE WON!!!!',results[key].total);

          }

        });
      });


        //Get Total Deals
         $scope.mydeals = Leads.getDealsTotal();

        $scope.mydeals.$promise.then(function(){
        ////console.log('Get taht Deal TOtal!');
        var data = [];

        // Verify we acutally have a response?
        if($scope.mydeals) {
          Object.keys($scope.mydeals).forEach(function(key) {

          // Verify we hvae usable data first
          if($scope.mydeals[key]._id) {
            if($scope.mydeals[key]._id && $scope.mydeals[key]._id !== 'total') {
              data.push({label: $scope.mydeals[key]._id, data: $scope.mydeals[key].total});
              //////console.log('Total: ', $scope.mydeals[key]._id + ' ' + $scope.mydeals[key].total);
            }
            //JSLint convert == to ===
            if($scope.mydeals[key]._id === 'total'){
            //Fill out box of Total Leads
            ////console.log('My Scope %o', $scope);
                 $scope.mydeals = $scope.mydeals[key].total;
                 //////console.log('Chads tingy: ', $scope.mydeals[key]._id);
            }
          }


        });
        }
        
        // Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
        //var plotChart1 = $.plot($('#leadschart'), data, pieChartOptions);
        // plotChart1.setData(data);
        // plotChart1.setupGrid();
        // plotChart1.draw();
      });




 var barChar2Options = {
            series: {
                stack: true,
                bars:{
                    show: true,
                    fill: 1,
                    barWidth: 1,
                    align: 'center',
                    horizontal: true
                  },
            grid:
            {
                hoverable: true,
                borderWidth: 1,
                borderColor: '#eeeeee',
              },
            tooltip: true,
            tooltipOpts:{
                defaultTheme: false  
              },
            colors: [$scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger],
          xaxis: {
            xaxisLabel: 'Test',
            max: 50
          }
          
        }
        };



          //Pie Chart of Lead Breakdown by Current Carrier
            // Upon our promise being fulfiled convert our data and re-rener the chart
      $scope.LeadCarrierTotals.$promise.then(function(){
        ////console.log('like a boss!');
        var data2 = [];
        Object.keys($scope.LeadCarrierTotals).forEach(function(key) {
          if($scope.LeadCarrierTotals[key]._id && $scope.LeadCarrierTotals[key]._id !== 'total') {
            data2.push({label: $scope.LeadCarrierTotals[key]._id, data: $scope.LeadCarrierTotals[key].total});
            //////console.log('Carrier: ', $scope.LeadCarrierTotals[key]._id + ' ' + $scope.LeadCarrierTotals[key].total);
        //////console.log('Getting Carrier Info: ',data2);
        
          }
        });
        
        // Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
        // var plotChart3 = $.plot($('#LeadCarrierTotals'), data2, pieChartOptions);
        // var plotChart4 = $.plot($('#LeadCarrier2Totals'), data2, barChar2Options);
        // plotChart1.setData(data);
        // plotChart1.setupGrid();
        // plotChart1.draw();
      });


 //Bar Chart for Current Carrier 

       


   
$scope.getLead = function(){
$scope.myleads = 'working';

  ////console.log('Myscope',$scope);
};




    }]);
})();