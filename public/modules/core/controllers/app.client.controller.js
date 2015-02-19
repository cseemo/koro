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
        
    


        .controller('woModalCtrl', ['$scope', 'shop', 'Workorders', 'Payments', 'Offenders',   function($scope, shop, Workorders, Payments, Offenders) {
          $scope.shop = shop;
          $scope.workorders = Workorders.query({
            shopId: shop._id
          });

          var getClientInfo = function(wo){
            console.log('Getting Client Info: ', wo._id);
            var client = Offenders.get({
              offenderId: wo.offender
            });
            client.$promise.then(function(client){
              console.log('Got our client', client);
              wo.clientName = client.displayName;
              wo.vehicleInfo = client.vehicleYear+' '+client.vehicleMake+' '+client.vehicleModel;

            });
          };

          var getPmtInfo = function(wo){
            console.log('Getting Payment Info: ', wo._id);
            var payment = Payments.query({
              workorder: wo._id
            });
            payment.$promise.then(function(pmt){
              console.log('Got Payment Details: ', pmt);
              wo.payment = pmt;
            });
          };

          $scope.workorders.$promise.then(function(wos){
            console.log('Got our workorders: ', wos);
            angular.forEach(wos, function(wo){
              getClientInfo(wo);
              getPmtInfo(wo);

            });
            // $scope.payments = Payments.query({
            //   workorder: wos._id

            // });
            // $scope.payments.$promise.then(function(pmt){
            //   console.log('Got our payments!!', pmt);

            // });
          

          });




        }])


        .controller('NavContainerCtrl', ['$scope', function($scope) {}]).
    controller('DashboardCtrl', ['$scope', 'Authentication', '$filter', 'socket', '$timeout', 'Shops', 'Workorders', '$modal',  function($scope, Authentication, $filter, socket, $timeout, Shops, Workorders, $modal) {
   
      
             socket.on('newconnect', function(data) {
        //console.log('Socket Data: %o', data);
        $scope.myObject = data;
      });

             var getOtherStuff = function(shop){
              var woCount = 0,
              installCount = 0,
              totalOwedToShop = 0,
              totalCollected = 0,
              shopBalance = 0,
              totalRevenue = 0,
              paidRevenue = 0;
              var counter = 0;

              console.log('Getting Stuff...', shop);
                    $scope.workorders = Workorders.query({ 
                    shopId: shop._id
                  });
                  console.log('WorkorderS: '+shop.name+': '+ $scope.workorders);
                  
                  
                  $scope.workorders.$promise
                  .then(function(wos){
                    shop.workorders = wos;
                    angular.forEach(wos, function(wo){
                      console.log('^^^^^^^^^^WORKORDER   '+counter+'    ^^^^^^^^^^^^^^^^^');
                      console.log('WOrkorder...', wo);
                      woCount++;
                      if(wo.type==='New Install'){
                        console.log('Weve got an install!!');
                        installCount++;
                      }
                      if(wo.amount){
                        // totalRevenue = parseInt(totalRevenue)+parseInt(wo.amount);
                        totalRevenue = parseFloat(totalRevenue, 2)+parseFloat(wo.amount, 2);
                        console.log('Total Revenue so far: ', totalRevenue);
                      }
                      if(wo.pmtStatus !== 'Due'){
                        console.log('Paid...', wo);
                         paidRevenue = parseFloat(paidRevenue, 2)+parseFloat(wo.amount, 2);
                      }else {
                        console.log('Payment Due');
                        console.log(wo);

                      }
                      console.log('This Shop has aWorkorder: ', woCount);
                        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                  });

                    shop.totalWorkorders = woCount;
                    shop.totalInstalls = installCount;
                    shop.totalRevenue = totalRevenue;
                    shop.paidRevenue = paidRevenue;


                  });


             };


             //Open Modal for Workorder Details
                $scope.openModal = function(type, row){
                  console.log('Row: ', row);

                  console.log('Opening Modal', type);
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
              //Get a report of teh following info
              //Service Center -- # of WorkOrders -- # of Installs -- $$ Collected -- $$ Owed by Customer -- $$ owed to shop
              //Step 1 - Get all Service Centers iterate thru each and get 
              //            - Get all Workorders Completed in Date Range w/ that ShopId
              //            - Get Workorder Details ($$ Owed, Paid or Owed)
              //Step 2 - Display?
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
                console.log('Got our Shps', $scope.shops);

                


                angular.forEach($scope.shops, function(shop){
                  counter++;
                  console.log('------------SHOP  '+counter+'    ---------------------');
                  woCount = 0;
                  installCount = 0,
                  totalOwedToShop = 0,
                  totalCollected = 0,
                  shopBalance = 0,
                  totalRevenue = 0;

                  console.log('Revenue Update: '+totalRevenue+ '  Workorder Count: '+woCount);

                  console.log('Shop ID: ', shop._id);

                  getOtherStuff(shop);
                  // $scope.workorders = Workorders.query({ 
                  //   shopId: shop._id
                  // });
                  // console.log('WorkorderS: '+shop.name+': '+ $scope.workorders);
                  
                  
                  // $scope.workorders.$promise
                  // .then(function(wos){
                  //   shop.workorders = wos;
                  //   angular.forEach(wos, function(wo){
                  //     console.log('^^^^^^^^^^WORKORDER   '+counter+'    ^^^^^^^^^^^^^^^^^');
                  //     console.log('WOrkorder...');
                  //     woCount++;
                  //     if(wo.type==='New Install'){
                  //       console.log('Weve got an install!!');
                  //       installCount++;
                  //     }
                  //     if(wo.amount){
                  //       // totalRevenue = parseInt(totalRevenue)+parseInt(wo.amount);
                  //       totalRevenue = parseFloat(totalRevenue, 2)+parseFloat(wo.amount, 2);
                  //       console.log('Total Revenue so far: ', totalRevenue);
                  //     }
                  //     console.log('This Shop has aWorkorder: ', woCount);
                  //       console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
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
                  console.log('*******************************************');
                });
      

              });


             };



    }]);
})();