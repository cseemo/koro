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
            secondary: '#3CBC8D',
            success: '#3CBC8D',
            info: '#29B7D3',
            infoAlt: '#666699',
            warning: '#FAC552',
            danger: '#E9422E',
            chad: '#666699'
          });
    }
  ])
        
        
        
        
        
        
        
// app.factory('notificationFactory', function () {
//     return {
//         success: function (text) {
//             toastr.success(text,"Success");
//         },
//         error: function (text) {
//             toastr.error(text, "Error");
//         }
//     };
// })
  .controller('HeaderCtrl', ['$scope', function($scope) {}])
// .directive('idle', function($idle, $timeout, $interval){
//   return {
//     restrict: 'A',
//     link: function(scope, elem, attrs) {
//       var timeout;
//       var timestamp = localStorage.lastEventTime;

//       // Watch for the events set in ng-idle's options
//       // If any of them fire (considering 500ms debounce), update localStorage.lastEventTime with a current timestamp
//       elem.on($idle._options().events, function(){
//         if (timeout) { $timeout.cancel(timeout); }
//         timeout = $timeout(function(){
//           localStorage.setItem('lastEventTime', new Date().getTime());
//         }, 500);
//       });

//       // Every 5s, poll localStorage.lastEventTime to see if its value is greater than the timestamp set for the last known event
//       // If it is, reset the ng-idle timer and update the last known event timestamp to the value found in localStorage
//       $interval(function() {
//         if (localStorage.lastEventTime > timestamp) {
//           $idle.watch();
//           timestamp = localStorage.lastEventTime;
//         } 
//       }, 5000);
//     }
//   }
// })
  //       .controller('EventsCtrl', ['ngIdle', function($scope, $idle, ngIdle) {
  //         var app = angular.module('demo', ['ngIdle']);
  //           $scope.events = [];

  //           $scope.$on('$idleStart', function() {
  //               // the user appears to have gone idle  
  //               window.alert('gone idle');                 
  //           });

  //           $scope.$on('$idleWarn', function(e, countdown) {
  //               // follows after the $idleStart event, but includes a countdown until the user is considered timed out
  //               // the countdown arg is the number of seconds remaining until then.
  //               // you can change the title or display a warning dialog from here.
  //               // you can let them resume their session by calling $idle.watch()
  //           });

  //           $scope.$on('$idleTimeout', function() {
  //               // the user has timed out (meaning idleDuration + warningDuration has passed without any activity)
  //               // this is where you'd log them
  //           })

  //           $scope.$on('$idleEnd', function() {
  //               // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog 
  //           });

  //           $scope.$on('$keepalive', function() {
  //               // do something to keep the user's session alive
  //           })

  //       }])
  //       .config(function($idleProvider, $keepaliveProvider) {
  //           // configure $idle settings
  //           $idleProvider.idleDuration(5); // in seconds
  //           $idleProvider.warningDuration(5); // in seconds
  //           $keepaliveProvider.interval(2); // in seconds
  //       })
  //       .run(function($idle){
  //           // start watching when the app runs. also starts the $keepalive service by default.
  //           $idle.watch();
  //       })


        .controller('NavContainerCtrl', ['$scope', function($scope) {}]).
    controller('DashboardCtrl', ['$scope', 'Authentication', 'Leads', 'Deals', '$filter',  function($scope, Authentication, Leads, Deals, $filter) {


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
        $scope.LeadStateTotals = Leads.getLeadTotalsByState();
        $scope.LeadCarrierTotals = Leads.getLeadTotalsByCarrier();



          //Pie Chart of Lead Breakdown by State
    // Upon our promise being fulfiled convert our data and re-rener the chart
      $scope.LeadStateTotals.$promise.then(function(){
        //console.log('like a boss!');
        var data = [];
        Object.keys($scope.LeadStateTotals).forEach(function(key) {
          if($scope.LeadStateTotals[key]._id && $scope.LeadStateTotals[key]._id !== 'total') {
            data.push({label: $scope.LeadStateTotals[key]._id, data: $scope.LeadStateTotals[key].total});
            //console.log('Total: ', $scope.LeadStateTotals[key]._id + ' ' + $scope.LeadStateTotals[key].total);
          }


        });
        
        // Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
        var plotChart2 = $.plot($('#leadsStatechart'), data, pieChartOptions);
        // plotChart1.setData(data);
        // plotChart1.setupGrid();
        // plotChart1.draw();
      });


          //Pie Chart of Lead Breakdown by Current Status
      // Upon our promise being fulfiled convert our data and re-rener the chart
      $scope.LeadTotals.$promise.then(function(){
        //console.log('like a boss!');
        var data = [];
        Object.keys($scope.LeadTotals).forEach(function(key) {
          if($scope.LeadTotals[key]._id && $scope.LeadTotals[key]._id !== 'total') {
            data.push({label: $scope.LeadTotals[key]._id, data: $scope.LeadTotals[key].total});
            //console.log('Total: ', $scope.LeadTotals[key]._id + ' ' + $scope.LeadTotals[key].total);
          }
          if($scope.LeadTotals[key]._id === 'total'){
            //Marin had double == JSLint suggested ===
          //Fill out box of Total Leads
               $scope.myleads = $scope.LeadTotals[key].total;
               //console.log('Chads tingy: ', $scope.LeadTotals[key].total);
          }

        });
        
        // Re-render the chart, we do this so that way we don't have to re-type in the options above. You can also do this by storing options in a variable
        var plotChart1 = $.plot($('#leadschart'), data, pieChartOptions);
        // plotChart1.setData(data);
        // plotChart1.setupGrid();
        // plotChart1.draw();
      });

        //Get Total MRC
      //    $scope.mrcTotal = Leads.getRevenueSold();
      //   //$scope.usermrcTotal = Leads.getRevenueSold();
      //   //$scope.totmrcTotal = Leads.getRevenueSold();

      //   $scope.mrcTotal.$promise.then(function(){
      //   //console.log('This user has how many roles? ', $scope.user.roles.length);
      //   var data = [];
      //   Object.keys($scope.mrcTotal).forEach(function(key) {
      //     if($scope.mrcTotal[key]._id && $scope.mrcTotal[key]._id !== 'total') {
      //       data.push({label: $scope.mrcTotal[key]._id, data: $scope.mrcTotal[key].total});
      //       ////console.log('Total: ', $scope.mrcTotal[key]._id + ' ' + $scope.mrcTotal[key].total);
      //     }
      //     if($scope.mrcTotal[key]._id === 'total'){
      //     //Fill out box of Total Leads
      //          $scope.mrcTotal = $scope.mrcTotal[key].total;
      //          ////console.log('Chads tingy: ', $scope.mrcTotal[key].total);
      //     }


      //   });
      //   //Semi colon above suggested by JSLint marin didn't have one

      // });



         $scope.mycallDetails = Leads.getCallsbyRep();

        $scope.mycallDetails.$promise.then(function(results){
          $scope.mycallDetails = 0;
        //console.log('Get call Details %o', results);
        Object.keys(results).forEach(function(key) {

          //console.log('Results Key %o', results[key]);
          //console.log(Authentication.user.displayName);
          //Converted == to === JSLint
          if(results[key]._id===Authentication.user.displayName)
          {
            $scope.mycallDetails = results[key].total;
            //console.log('WE WON, JOHNNY WE WON!!!!',results[key].total);

          }

        });
      });


        //Get Total Deals
         $scope.mydeals = Leads.getDealsTotal();

        $scope.mydeals.$promise.then(function(){
        //console.log('Get taht Deal TOtal!');
        var data = [];
        Object.keys($scope.mydeals).forEach(function(key) {
          if($scope.mydeals[key]._id && $scope.mydeals[key]._id !== 'total') {
            data.push({label: $scope.mydeals[key]._id, data: $scope.mydeals[key].total});
            ////console.log('Total: ', $scope.mydeals[key]._id + ' ' + $scope.mydeals[key].total);
          }
          //JSLint convert == to ===
          if($scope.mydeals[key]._id === 'total'){
          //Fill out box of Total Leads
          //console.log('My Scope %o', $scope);
               $scope.mydeals = $scope.mydeals[key].total;
               ////console.log('Chads tingy: ', $scope.mydeals[key]._id);
          }


        });
        
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
        //console.log('like a boss!');
        var data2 = [];
        Object.keys($scope.LeadCarrierTotals).forEach(function(key) {
          if($scope.LeadCarrierTotals[key]._id && $scope.LeadCarrierTotals[key]._id !== 'total') {
            data2.push({label: $scope.LeadCarrierTotals[key]._id, data: $scope.LeadCarrierTotals[key].total});
            ////console.log('Carrier: ', $scope.LeadCarrierTotals[key]._id + ' ' + $scope.LeadCarrierTotals[key].total);
        ////console.log('Getting Carrier Info: ',data2);
        
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

  //console.log('Myscope',$scope);
};




    }]);
})();