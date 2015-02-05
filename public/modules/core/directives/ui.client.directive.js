'use strict';
angular.module('core').directive('uiTime', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, ele) {
        var checkTime, startTime;
        startTime = function() {
          var h, m, s, t, time, today;
          today = new Date();
          h = today.getHours();
          m = today.getMinutes();
          s = today.getSeconds();
          m = checkTime(m);
          s = checkTime(s);
          time = h + ':' + m + ':' + s;
          ele.html(time);
          return (t = setTimeout(startTime, 500));
        };
        checkTime = function(i) {
          if (i < 10) {
            i = '0' + i;
          }
          return i;
        };
        return startTime();
      }
    };
  }
]).directive('confirmDelete', function() {
  return {
    replace: false,
    templateUrl: 'modules/core/views/delete.confirm.view.html',
    scope: {
      onConfirm: '&'
    },
    controller: function($scope) {
      $scope.isDeleting = false;
      $scope.startDelete = function() {
        return $scope.isDeleting = true;
      };
      $scope.cancel = function() {
        return $scope.isDeleting = false;
      };
      return $scope.confirm = function() {
        return $scope.onConfirm();
      };
    }
  };
})


.directive('uiNotCloseOnClick', [
  function() {
    return {
      restrict: 'A',
      compile: function(ele, attrs) {
        return ele.on('click', function(event) {
          return event.stopPropagation();
        });
      }
    };
  }
]);/*.directive('slimScroll', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, ele, attrs) {
        return ele.slimScroll({
          height: attrs.scrollHeight || '100%'
        });
      }
    };
  }
]);*/