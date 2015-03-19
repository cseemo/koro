(function(){
  'use strict';

  angular.module('core').controller('AppController', ['$scope', '$rootScope',
    function($scope, $rootScope) {

          $scope.main = {
            brand: "Budget IID",
            name: 'Justin Uftudrinch'
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
            fixedHeader: false,
            fixedSidebar: false,
            pageTransition: $scope.pageTransitionOpts[1]
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
            primary: '#273b42',
            secondary: '#ec5f3c',
            success: '#449d44',
            info: '#428bca',
            infoAlt: '#666699',
            warning: '#FAC552',
            danger: '#E9422E',
            chad: '#666699'
          });



    }
  ])
        
    


        .controller('woModalCtrl', ['$scope', 'shop', 'Workorders', 'Payments', 'Offenders', '$modalInstance',   function($scope, shop, Workorders, Payments, Offenders, $modalInstance) {
          $scope.shop = shop;
          $scope.workorders = Workorders.query({
            shopId: shop._id
          });

          $scope.close = function(){

        $modalInstance.dismiss('cancel');
     };
          

          var getClientInfo = function(wo){
           //console.log('Getting Client Info: ', wo._id);
            var client = Offenders.get({
              offenderId: wo.offender
            });
            client.$promise.then(function(client){
             //console.log('Got our client', client);
              wo.clientName = client.displayName;
              wo.vehicleInfo = client.vehicleYear+' '+client.vehicleMake+' '+client.vehicleModel;

            });
          };

          var getPmtInfo = function(wo){
           //console.log('Getting Payment Info: ', wo._id);
            var payment = Payments.query({
              workorder: wo._id
            });
            payment.$promise.then(function(pmt){
             //console.log('Got Payment Details: ', pmt);
              wo.payment = pmt;
            });
          };

          $scope.workorders.$promise.then(function(wos){
           //console.log('Got our workorders: ', wos);
            angular.forEach(wos, function(wo){
              getClientInfo(wo);
              getPmtInfo(wo);

            });
            // $scope.payments = Payments.query({
            //   workorder: wos._id

            // });
            // $scope.payments.$promise.then(function(pmt){
            //  //console.log('Got our payments!!', pmt);

            // });
          

          });




        }])


        .controller('NavContainerCtrl', ['$scope', function($scope) {}]).
    controller('DashboardCtrl', ['$scope', 'Authentication', '$filter', 'socket', '$timeout', 'Shops', 'Workorders', '$modal',  function($scope, Authentication, $filter, socket, $timeout, Shops, Workorders, $modal) {
   
      
             socket.on('newconnect', function(data) {
        //console.log('Socket Data: %o', data);
        $scope.myObject = data;
      });

             var getOtherStuff = function(shop, startDate, endDate, callback){
              var woCount = 0,
              installCount = 0,
              totalOwedToShop = 0,
              totalCollected = 0,
              shopBalance = 0,
              totalRevenue = 0,
              paidRevenue = 0;
              var counter = 0;

             //console.log('Getting Stuff...', shop);
                    $scope.workorders = Workorders.query({ 
                    shopId: shop._id,
                    status: 'Complete',
                   
                  });
                 //console.log('WorkorderS: '+shop.name+': '+ $scope.workorders);
                  
                  
                  $scope.workorders.$promise
                  .then(function(wos){

                   //console.log('Start Date: ', startDate);
                   //console.log('End Date: ', endDate);

                    var startDt = moment(startDate).format('YYYY-MM-DD');
                    var endDt = moment(endDate).format('YYYY-MM-DD');
                    // var startDt = startDate;
                    // var endDt = endDate;
                    var created;
                    angular.forEach(wos, function(wo){
                     //console.log('Created Date: ', wo.created);
                      // 
                      created = moment(wo.created).format('YYYY-MM-DD');
                     //console.log('Our comparison date: ', created);
                      if(created >= startDt && created <= endDt){
                       //console.log('This Workorder shall be included');

                     //console.log('^^^^^^^^^^WORKORDER   '+counter+'    ^^^^^^^^^^^^^^^^^');
                     //console.log('WOrkorder...', wo);
                      woCount++;
                      if(wo.type==='New Install'){
                       //console.log('Weve got an install!!');
                        installCount++;
                      }
                      if(wo.amount){
                        // totalRevenue = parseInt(totalRevenue)+parseInt(wo.amount);
                        totalRevenue = parseFloat(totalRevenue, 2)+parseFloat(wo.amount, 2);
                       //console.log('Total Revenue so far: ', totalRevenue);
                      }
                      if(wo.shopFee){
                       //console.log('Wo has a Shop Fee: ', wo.shopFee);
                        totalOwedToShop = parseFloat(totalOwedToShop)+parseFloat(wo.shopFee);
                      }

                      if(wo.pmtStatus !== 'Due'){
                       //console.log('Paid...', wo);
                         paidRevenue = parseFloat(paidRevenue, 2)+parseFloat(wo.amount, 2);
                        
                      }else {
                       //console.log('Payment Due');
                       //console.log(wo);

                      }
                     //console.log('This Shop has aWorkorder: ', woCount);
                       //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

                         }else {
                       //console.log('Skipping Workorder');

                      }

                  });

                    shop.totalWorkorders = woCount;
                    shop.totalInstalls = installCount;
                    shop.totalRevenue = totalRevenue;
                    shop.paidRevenue = paidRevenue;
                    shop.totalOwedToShop = totalOwedToShop;
                    shopBalance = parseFloat(totalOwedToShop)-parseFloat(paidRevenue);
                    shop.shopBalance = shopBalance;
                    callback(shop);

                  });


             };


             //Open Modal for Workorder Details
                $scope.openModal = function(type, row){
                 //console.log('Row: ', row);

                 //console.log('Opening Modal', type);
                  var template = 'modules/core/views/woDetails.html';
                  var size = 'lg';
                  var controller = 'woModalCtrl';


                  if(type==='checkin'){
                    template = 'modules/devices/views/create-device.client.view.html';
                    size = 'sm';
                  
                  }
                  if(type==='shopCheckInModal'){
                    template = 'shopCheckInModal.html';
                    size = 'lg';
                    controller = 'shopInventoryCtrl';
                  
                  }

                  

                    var modalInstance = $modal.open({
                        templateUrl: template,
                        controller: controller,
                        size: size,
                        resolve: {
                          shop: function() {
                            return $scope.shops[row];
                          }

                          },
                          
                         
                    });

      };


             $scope.getReport = function() {
              $scope.lookUpPending = true;
              //Get a report of teh following info
              //Service Center -- # of WorkOrders -- # of Installs -- $$ Collected -- $$ Owed by Customer -- $$ owed to shop
              //Step 1 - Get all Service Centers iterate thru each and get 
              //            - Get all Workorders Completed in Date Range w/ that ShopId
              //            - Get Workorder Details ($$ Owed, Paid or Owed)
              //Step 2 - Display?
              var startDate;
              var endDate;
             //console.log('Starting Date: ', $scope.startDt);
             //console.log('Ending Date', $scope.endDt);
              if($scope.endDt < $scope.startDt){
              //console.log('Dates are Illogical - reversing them');
               startDate = $scope.endDt
               endDate = $scope.startDt;
              } else {
                startDate = $scope.startDt
               endDate = $scope.endDt;
              }
              var woCount = 0,
              installCount = 0,
              totalOwedToShop = 0,
              totalCollected = 0,
              shopBalance = 0,
              totalRevenue = 0;
              var counter = 0;
              $scope.shops = Shops.query();
              $scope.shops.$promise
              .then(function(shops){
               //console.log('Got our Shps', $scope.shops);
            angular.forEach($scope.shops, function(shop){
                  
                 //console.log('------------SHOP  '+counter+'    ---------------------');
                  woCount = 0;
                  installCount = 0,
                  totalOwedToShop = 0,
                  totalCollected = 0,
                  shopBalance = 0,
                  totalRevenue = 0;

                 //console.log('Revenue Update: '+totalRevenue+ '  Workorder Count: '+woCount);

                 //console.log('Shop ID: ', shop._id);

                  getOtherStuff(shop, startDate, endDate, function(retShop){
                    console.log('Return SHop Info: ', retShop);
                    counter++;
                    if(counter===$scope.shops.length){
                      console.log('Shops and Counter === ', counter);
                      console.log('Shop LEngth: ', $scope.shops.length);
                      $scope.lookUpPending = false;
                      $scope.lookUpDone = true;
                    }
                  });


                  // $scope.workorders = Workorders.query({ 
                  //   shopId: shop._id
                  // });
                  ////console.log('WorkorderS: '+shop.name+': '+ $scope.workorders);
                  
                  
                  // $scope.workorders.$promise
                  // .then(function(wos){
                  //   shop.workorders = wos;
                  //   angular.forEach(wos, function(wo){
                  //    //console.log('^^^^^^^^^^WORKORDER   '+counter+'    ^^^^^^^^^^^^^^^^^');
                  //    //console.log('WOrkorder...');
                  //     woCount++;
                  //     if(wo.type==='New Install'){
                  //      //console.log('Weve got an install!!');
                  //       installCount++;
                  //     }
                  //     if(wo.amount){
                  //       // totalRevenue = parseInt(totalRevenue)+parseInt(wo.amount);
                  //       totalRevenue = parseFloat(totalRevenue, 2)+parseFloat(wo.amount, 2);
                  //      //console.log('Total Revenue so far: ', totalRevenue);
                  //     }
                  //    //console.log('This Shop has aWorkorder: ', woCount);
                  //      //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                  // });

                    // shop.totalWorkorders = woCount;
                    // shop.totalInstalls = installCount;
                    // shop.totalRevenue = totalRevenue;


                  // });

                  // device.shop = $scope.authentication.user.shop;
                  // device.status = 'Pending Deployment';
                  // device.details.push({
                  //   type: 'Received by Shop',
                  //   updated: Date.now(),
                  //   destination: 'Shop Shelf',
                  //   requestor: $scope.authentication.user.displayName
                 //console.log('*******************************************');
                });
      

              });


             };


             //Date Picker Stuff


 $scope.today = function() {
        return $scope.dt = new Date();
      };
      $scope.today();
      $scope.showWeeks = true;
      $scope.toggleWeeks = function() {
        return $scope.showWeeks = !$scope.showWeeks;
      };
      $scope.clear = function() {
        return $scope.dt = null;
      };
      $scope.disabled = function(date, mode) {
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      };
      $scope.toggleMin = function() {
        var _ref;
        return $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
          "null": new Date()
        };
      };
      $scope.toggleMin();
      $scope.openCalendar = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return $scope.opened = true;
      };
      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 7
      };
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = $scope.formats[0];
   

$scope.mytime = $scope.dt;
      $scope.hstep = 1;
      $scope.mstep = 5;
      $scope.options = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
      };
      $scope.ismeridian = true;
      $scope.toggleMode = function() {
        return $scope.ismeridian = !$scope.ismeridian;
      };


      $scope.update = function() {
        var d;
        d = new Date();
        d.setHours(14);
        d.setMinutes(0);
        return $scope.mytime = d;
      };

      $scope.changed = function() {
        return //////////console.log('Time changed to: ' + $scope.mytime);
      };

      return $scope.clear = function() {
        return $scope.mytime = null;
};




    }]);
})();