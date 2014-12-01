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
          test = test.substring(0,14);
          // console.log('Test Path',test);

          if(test==='/svccntrsignup' || test==='/letsdoi'){
            // console.log('We got it approved');
            path = '/svccntrsignup';
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
            case '/svccntrsignup':
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
}).directive("cbInline", function($timeout, $rootScope) {
    var template;
  console.log('Got to Directive!: ', $rootScope);
  if($rootScope.showEdits){
    console.log('Need to show our edits!!');
    template = "<span class=\"InlineEditWidget\">\n  <span ng:show=\"editing\" class=\"InlineEditing\">\n     <span class=\"transclude-root\" ng:transclude></span>\n  </span>\n\n  <span class=\"InlineEditable\" ng:hide=\"editing\"  ng:click=\"enter()\">{{altModel || model}}&nbsp;</span>\n\n</span>";

  }else {
    console.log('Standard view');
    // template = "<span class=\"InlineEditWidget\">\n  <span ng:show=\"editing\" class=\"InlineEditing\">\n     <span class=\"transclude-root\" ng:transclude></span>\n  </span>\n\n  <span class=\"InlineEditable\" ng:hide=\"editing\"  ng:dblclick=\"enter()\">{{altModel || model}}&nbsp;</span>\n\n</span>";
template = "<span class=\"InlineEditWidget\">\n  <span ng:show=\"editing\" class=\"InlineEditing\">\n     <span class=\"transclude-root\" ng:transclude></span>\n  </span>\n\n  <span class=\"InlineEditable\" ng:hide=\"editing\"  ng:click=\"enter()\">{{altModel || model}}&nbsp;</span>\n\n</span>";

  }
 
  return {
    transclude: "element",
    priority: 2,
    scope: {
      model: "=ngModel",
      altModel: "=cbInline"
    },
    template: template,
    replace: true,
    link: function(scope, elm, attr) {
      console.log('Line 156: Scope: ', scope);
      var originalValue, transcluded;
      originalValue = scope.model;
      transcluded = elm.find(".transclude-root").children().first();
      transcluded.bind("keydown", function(e) {
        if (e.keyCode === 27) {
          return scope.$apply(scope.cancel);
        }
      });
      transcluded.bind("blur", function() {
        console.log('About to blur');
        scope.leave();
        return scope.$apply();
      });
      scope.enter = function() {
        console.log('About to edit this field');
        scope.editing = true;
        originalValue = scope.model;
        return $timeout((function() {
          var input;
          input = elm.find("input");
          if (input.size() > 0) {
            input[0].focus();
            return input[0].select();
          }
        }), 0, false);
      };
      scope.leave = function() {
        return scope.editing = false;
        console.log('Need to save');
      };
      return scope.cancel = function() {
        scope.editing = false;
        console.log('Dont need to save');
        return scope.model = originalValue;
      };
    }
  };
});
