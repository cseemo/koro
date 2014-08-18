(function(){

  'use strict';

  angular.module('core').controller('NotifyCtrl', [
    '$scope', 'logger', function($scope, logger) {
      return ($scope.notify = function(type) {
        switch (type) {
          case 'info':
            return logger.log('Hola! Heads up! This alert needs your attention, but it\'s not super important.');
          case 'success':
            return logger.logSuccess('Well done! You successfully read this important alert message.');
          case 'warning':
            return logger.logWarning('Warning! Best check yo self, you\'re not looking too good.');
          case 'error':
            return logger.logError('Oh snap! Change a few things up and try submitting again.');
        }
      });
    }
  ]).controller('AlertDemoCtrl', [
    '$scope', function($scope) {
      $scope.alerts = [
        {
          type: 'success',
          msg: 'Well done! You successfully read this important alert message.'
        }, {
          type: 'info',
          msg: 'Heads up! This alert needs your attention, but it is not super important.'
        }, {
          type: 'warning',
          msg: 'Warning! Best check yo self, you\'re not looking too good.'
        }, {
          type: 'danger',
          msg: 'Oh snap! Change a few things up and try submitting again.'
        }
      ];
      $scope.addAlert = function() {
        var num, type;
        num = Math.ceil(Math.random() * 4);
        type = void 0;
        switch (num) {
          case 0:
            type = 'info';
            break;
          case 1:
            type = 'success';
            break;
          case 2:
            type = 'info';
            break;
          case 3:
            type = 'warning';
            break;
          case 4:
            type = 'danger';
        }
        return $scope.alerts.push({
          type: type,
          msg: 'Another alert!'
        });
      };
      return ($scope.closeAlert = function(index) {
        return $scope.alerts.splice(index, 1);
      });
    }
  ]).controller('ProgressDemoCtrl', [
    '$scope', function($scope) {
      $scope.max = 200;
      $scope.random = function() {
        var type, value;
        value = Math.floor((Math.random() * 100) + 10);
        type = void 0;
        if (value < 25) {
          type = 'success';
        } else if (value < 50) {
          type = 'info';
        } else if (value < 75) {
          type = 'warning';
        } else {
          type = 'danger';
        }
        $scope.showWarning = type === 'danger' || type === 'warning';
        $scope.dynamic = value;
        $scope.type = type;
      };
      return $scope.random();
    }
  ]).controller('AccordionDemoCtrl', [
    '$scope', function($scope) {
      $scope.oneAtATime = true;
      $scope.groups = [
        {
          title: 'Dynamic Group Header - 1',
          content: 'Dynamic Group Body - 1'
        }, {
          title: 'Dynamic Group Header - 2',
          content: 'Dynamic Group Body - 2'
        }, {
          title: 'Dynamic Group Header - 3',
          content: 'Dynamic Group Body - 3'
        }
      ];
      $scope.items = ['Item 1', 'Item 2', 'Item 3'];
      $scope.status = {
        isFirstOpen: true,
        isFirstOpen1: true,
        isFirstOpen2: true,
        isFirstOpen3: true,
        isFirstOpen4: true,
        isFirstOpen5: true,
        isFirstOpen6: true
      };
      $scope.addItem = function() {
        var newItemNo;
        newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
      };
    }
  ]).controller('CollapseDemoCtrl', [
    '$scope', function($scope) {
      return ($scope.isCollapsed = false);
    }
  ]).controller('ModalDemoCtrl', [
    '$scope', '$modal', '$log', function($scope, $modal, $log) {
      $scope.items = ['item1', 'item2', 'item3'];
      $scope.open = function() {
        var modalInstance;
        modalInstance = $modal.open({
          templateUrl: 'myModalContent.html',
          controller: 'ModalInstanceCtrl',
          resolve: {
            items: function() {
              return $scope.items;
            }
          }
        });
        modalInstance.result.then(function(selectedItem) {
          $scope.selected = selectedItem;
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };
    }
  ]).controller('ModalInstanceCtrl', [
    '$scope', '$modalInstance', 'items', function($scope, $modalInstance, items) {
      $scope.items = items;
      $scope.selected = {
        item: $scope.items[0]
      };
      $scope.ok = function() {
        $modalInstance.close($scope.selected.item);
      };
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    }
  ]).controller('PaginationDemoCtrl', [
    '$scope', function($scope) {
      $scope.totalItems = 64;
      $scope.currentPage = 4;
      $scope.setPage = function(pageNo) {
        return ($scope.currentPage = pageNo);
      };
      $scope.maxSize = 5;
      $scope.bigTotalItems = 175;
      return ($scope.bigCurrentPage = 1);
    }
  ]).controller('TabsDemoCtrl', [
    '$scope', function($scope) {
      $scope.tabs = [
        {
          title: 'Dynamic Title 1',
          content: 'Dynamic content 1.  Consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at.'
        }, {
          title: 'Disabled',
          content: 'Dynamic content 2.  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, quidem, officiis, et ex laudantium sed cupiditate voluptatum libero nobis sit illum voluptates beatae ab. Ad, repellendus non sequi et at.',
          disabled: true
        }
      ];
      return ($scope.navType = 'pills');
    }
  ]).controller('TreeDemoCtrl', [
    '$scope', function($scope) {
      $scope.list = [
        {
          id: 1,
          title: 'Item 1',
          items: []
        }, {
          id: 2,
          title: 'Item 2',
          items: [
            {
              id: 21,
              title: 'Item 2.1',
              items: [
                {
                  id: 211,
                  title: 'Item 2.1.1',
                  items: []
                }, {
                  id: 212,
                  title: 'Item 2.1.2',
                  items: []
                }
              ]
            }, {
              id: 22,
              title: 'Item 2.2',
              items: [
                {
                  id: 221,
                  title: 'Item 2.2.1',
                  items: []
                }, {
                  id: 222,
                  title: 'Item 2.2.2',
                  items: []
                }
              ]
            }
          ]
        }, {
          id: 3,
          title: 'Item 3',
          items: []
        }, {
          id: 4,
          title: 'Item 4',
          items: [
            {
              id: 41,
              title: 'Item 4.1',
              items: []
            }
          ]
        }, {
          id: 5,
          title: 'Item 5',
          items: []
        }, {
          id: 6,
          title: 'Item 6',
          items: []
        }, {
          id: 7,
          title: 'Item 7',
          items: []
        }
      ];
      $scope.selectedItem = {};
      $scope.options = {};
      $scope.remove = function(scope) {
        scope.remove();
      };
      $scope.toggle = function(scope) {
        scope.toggle();
      };
      return ($scope.newSubItem = function(scope) {
        var nodeData;
        nodeData = scope.$modelValue;
        nodeData.items.push({
          id: nodeData.id * 10 + nodeData.items.length,
          title: nodeData.title + '.' + (nodeData.items.length + 1),
          items: []
        });
      });
    }
  ]).controller('MapDemoCtrl', [ // This may be an inncorect way to do dependancy injection!!
    '$scope', '$http', '$interval', 'google', function($scope, $http, $interval, google) {
      var i, markers;
      markers = [];
      i = 0;
      while (i < 8) {
        markers[i] = new google.maps.Marker({
          title: 'Marker: ' + i
        });
        i++;
      }
      $scope.GenerateMapMarkers = function() {
        var d, lat, lng, loc, numMarkers;
        d = new Date();
        $scope.date = d.toLocaleString();
        numMarkers = Math.floor(Math.random() * 4) + 4;
        i = 0;
        while (i < numMarkers) {
          lat = 43.6600000 + (Math.random() / 100);
          lng = -79.4103000 + (Math.random() / 100);
          loc = new google.maps.LatLng(lat, lng);
          markers[i].setPosition(loc);
          markers[i].setMap($scope.map);
          i++;
        }
      };
      $interval($scope.GenerateMapMarkers, 2000);
    }
  ]);
})();


(function() {
  'use strict';
  angular.module('core').controller('TagsDemoCtrl', [
    '$scope', function($scope) {
      return $scope.tags = ['foo', 'bar'];
    }
  ]).controller('DatepickerDemoCtrl', [
    '$scope', function($scope) {
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
      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        return $scope.opened = true;
      };
      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
      };
      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      return $scope.format = $scope.formats[0];
    }
  ]).controller('TimepickerDemoCtrl', [
    '$scope', function($scope) {
      $scope.mytime = new Date();
      $scope.hstep = 1;
      $scope.mstep = 15;
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
        return console.log('Time changed to: ' + $scope.mytime);
      };
      return $scope.clear = function() {
        return $scope.mytime = null;
      };
    }
  ]).controller('TypeaheadCtrl', [
    '$scope', function($scope) {
      $scope.selected = void 0;
      return $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    }
  ]).controller('RatingDemoCtrl', [
    '$scope', function($scope) {
      $scope.rate = 7;
      $scope.max = 10;
      $scope.isReadonly = false;
      $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        return $scope.percent = 100 * (value / $scope.max);
      };
      return $scope.ratingStates = [
        {
          stateOn: 'glyphicon-ok-sign',
          stateOff: 'glyphicon-ok-circle'
        }, {
          stateOn: 'glyphicon-star',
          stateOff: 'glyphicon-star-empty'
        }, {
          stateOn: 'glyphicon-heart',
          stateOff: 'glyphicon-ban-circle'
        }, {
          stateOn: 'glyphicon-heart'
        }, {
          stateOff: 'glyphicon-off'
        }
      ];
    }
  ]);

}).call(this);