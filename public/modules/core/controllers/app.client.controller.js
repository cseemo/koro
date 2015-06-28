(function(){
  'use strict';

  angular.module('core').controller('AppController', ['$scope', '$rootScope',
    function($scope, $rootScope) {

          $scope.main = {
            brand: "Swell Farmacy",
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
            primary: '#006C91',
            secondary: '#0181AA',
            success: '#449d44',
            info: '#045270',
            infoAlt: '#313D52',
            warning: '#F08A47',
            danger: '#752E1E',
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
    controller('DashboardCtrl', ['$scope', 'Authentication', '$filter', 'socket', '$timeout', 'Shops', 'Workorders', '$modal', 'Payments',   function($scope, Authentication, $filter, socket, $timeout, Shops, Workorders, $modal, Payments) {
   
      
             socket.on('newconnect', function(data) {
        //console.log('Socket Data: %o', data);
        $scope.myObject = data;
      });


            var processPmt = function(wo, pmt, shop, callback){
              console.log('Processing Payment now');

               woCount++;
                      if(wo.type==='New Install'){
                       console.log('Weve got an install!!');
                        installCount++;
                      }
                      if(wo.amount){
                        // totalRevenue = parseInt(totalRevenue)+parseInt(wo.amount);
                        totalRevenue = parseFloat(totalRevenue, 2)+parseFloat(wo.amount, 2);
                       //console.log('Total Revenue so far: ', totalRevenue);
                      }
                     
                       //If the Shop collected Cash - add to Total Collected
                       //IF the Shop is a Charge to the Customer add to Total Collected
                       

                       if(shop.installType!=='Shop to Charge Customer'){
                        console.log('This shop charges the customer');

                       }else{
                        //The payment came to budget
                        console.log('This guy did NOT keep the money');
                       }
                       //Add the TOTAL SHop Fees
                        totalOwedToShop = parseFloat(totalOwedToShop)+parseFloat(wo.shopFee);
                      console.log('This shop is owed '+totalOwedToShop+' so far...');

                      if(wo.pmtStatus === 'Paid'){
                       console.log('Paid...', wo.amount);
                         paidRevenue = parseFloat(paidRevenue, 2)+parseFloat(wo.amount, 2);
                        
                      }else {
                       console.log('Payment Due');
                       //console.log(wo);

                      }
                     //console.log('This Shop has aWorkorder: ', woCount);
                       //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');

                     
                        console.log('Done with '+shop.name);
                        return callback(shop);
                  

          };

             var getPaymentInfo = function(wo, pmt, callback){
              console.log('Getting Payment Details to return back');

             };


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
                      created = moment(wo.completed).format('YYYY-MM-DD');
                     //console.log('Our comparison date: ', created);
                      if(created >= startDt && created <= endDt){
                        

                       var payment =  Payments.query({
                          workorder: wo._id
                          });
                          
                        payment.$promise
                          .then(function(pmt){

                               console.log('Payments are here - take first One', pmt);
                            
                            if(pmt.length > 0){
                              
                             
                              pmt = pmt[0];
                              console.log('Got the Payment ', pmt);
                          

                            } else {
                            console.log('Payment does not exist');
                            }
                       //console.log('This Workorder shall be included');

                     //console.log('^^^^^^^^^^WORKORDER   '+counter+'    ^^^^^^^^^^^^^^^^^');
                     //console.log('WOrkorder...', wo);

                     //Check if we need to get payment info
                     woCount++

                      if(wo.shopFee){
                       console.log('Wo has a Shop Fee: ', wo.shopFee);
                       console.log('WO ID: ', wo._id);
                       totalOwedToShop = parseFloat(totalOwedToShop)+parseFloat(wo.shopFee);
              
                     } else {
                      console.log('No Shop Fee');
                      console.log('Process payment now...');
                       


                     }



                      if(wo.type==='New Install'){
                       console.log('Weve got an install!!');
                        installCount++;
                      }
                      if(wo.amount){
                        // totalRevenue = parseInt(totalRevenue)+parseInt(wo.amount);
                        totalRevenue = parseFloat(totalRevenue, 2)+parseFloat(wo.amount, 2);
                       //console.log('Total Revenue so far: ', totalRevenue);
                      }
                     
                       //If the Shop collected Cash - add to Total Collected
                       //IF the Shop is a Charge to the Customer add to Total Collected
                       

                       
                       //Add the TOTAL SHop Fees
                       
                      console.log(shop.name+' is owed '+totalOwedToShop+' so far...');

                      if(wo.pmtStatus === 'Paid'){
                       console.log('Paid...'+ wo.amount+' via '+pmt.pmtOpt);

                         paidRevenue = parseFloat(paidRevenue, 2)+parseFloat(wo.amount, 2);
                         console.log('Total Revenue Paid so far');

                         if(shop.installType==='Shop to Charge Customer'){
                            console.log(shop.name+' charges the customer directly');
                             totalCollected = parseFloat(totalCollected, 2)+parseFloat(wo.amount, 2);
                             console.log('Total Collected Thus Far: ', totalCollected);
                         }else{
                          //The payment came to budget
                          if(pmt.pmtOpt==='Cash'){
                            console.log('Cash Payment of '+pmt.amount);
                             totalCollected = parseFloat(totalCollected, 2)+parseFloat(wo.amount, 2);
                          }
                          console.log('This guy did NOT keep the money');
                         }

                        
                      }else {
                       console.log('Payment Due');
                       //console.log(wo);

                      }




                      

                       console.log('-----------------------Done with '+shop.name);
                    shop.totalWorkorders = parseInt(woCount);
                    shop.totalInstalls = installCount;
                    shop.totalRevenue = totalRevenue;
                    shop.paidRevenue = paidRevenue;
                    shop.totalOwedToShop = totalOwedToShop;
                    shop.totalCollected = totalCollected;
                    shopBalance = parseFloat(totalOwedToShop)-parseFloat(totalCollected);
                    shop.shopBalance = shopBalance;
                    callback(shop);




                        });
} else {
  console.log('Ignoring not in the timeframe');
  callback(shop);
}


                     });

                      //Should run after everything above it
                    



            
      
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
              $scope.lookUpDone = false;
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
              var shopsRun = 0;
              $scope.shops = Shops.query();
              $scope.shops.$promise
              .then(function(shops){

               //console.log('Got our Shps', $scope.shops);
               var shopsLength = $scope.shops.length;
               // shopsLength = shopsLength+1;
               console.log('# of Shops: ', shopsLength);
            angular.forEach($scope.shops, function(shop){
                  
                 console.log('------------SHOP  '+counter+'    ---------------------');
                  woCount = 0;
                  installCount = 0,
                  totalOwedToShop = 0,
                  totalCollected = 0,
                  shopBalance = 0,
                  totalRevenue = 0;

                 //console.log('Revenue Update: '+totalRevenue+ '  Workorder Count: '+woCount);

                 //console.log('Shop ID: ', shop._id);
                shopsRun++;
                  getOtherStuff(shop, startDate, endDate, function(retShop){
                    console.log('Return SHop Info: ', retShop);
                     counter++;
                    shop = retShop;
                    console.log('Count : ', counter);

                 if(shopsRun > shopsLength){
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

                 console.log('Line 463 - ShopsRun', shopsRun);
                 

                });
      
          console.log('############## LINE 466 ################');
              });


                console.log('!!!!!!   470   !!!!!!');

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