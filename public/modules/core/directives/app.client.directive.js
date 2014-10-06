'use strict';

angular.module('core').directive('imgHolder', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, ele, attrs) {
        return (Holder.run({
          images: ele[0]
        }));
      }
    };
  }
]).directive('customPage', function() {
  return {
    restrict: 'A',
    controller: [
      '$scope', '$element', '$location', function($scope, $element, $location) {
        var addBg, path;

         path = function() {
          var test = $location.path();
          test = test.substring(0,8);
          // console.log('Test Path',test);

          if(test==='/approve'){
            // console.log('We got it approved');
            path = '/approve';
             return $element.addClass('body-wide');
          }else{

          return $location.path();
          }
         
        };
        addBg = function(path) {
          // console.log('Path -- ',path);
          $element.removeClass('body-wide body-lock');
          switch (path) {
            case '/404':
            case '/pages/404':
            case '/pages/500':
            case '/signin':
            case '/signup':
            case '/approve':
            case '/pages/forgot-password':
              return $element.addClass('body-wide');
            case '/lock':
              return $element.addClass('body-wide body-lock');
          }
        };
        addBg($location.path());
        return $scope.$watch(path, function(newVal, oldVal) {
          if (newVal === oldVal) {
            return;
          }
          return addBg($location.path());
        });
      }
    ]
  };
}).directive('uiColorSwitch', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, ele, attrs) {
        return ele.find('.color-option').on('click', function(event) {
          var $this, hrefUrl, style;
          $this = $(this);
          hrefUrl = void 0;
          style = $this.data('style');
          if (style === 'loulou') {
            hrefUrl = 'styles/main.css';
            $('link[href^="styles/main"]').attr('href', hrefUrl);
          } else if (style) {
            style = '-' + style;
            hrefUrl = 'styles/main' + style + '.css';
            $('link[href^="styles/main"]').attr('href', hrefUrl);
          } else {
            return false;
          }
          return event.preventDefault();
        });
      }
    };
  }
]).directive('goBack', [
  function() {
    return {
      restrict: 'A',
      controller: [
        '$scope', '$element', '$window', function($scope, $element, $window) {
          return $element.on('click', function() {
            return $window.history.back();
          });
        }
      ]
    };
  }
]).filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country === 1) {
            country = '';
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + ' (' + city + ') ' + number).trim();
    };
});