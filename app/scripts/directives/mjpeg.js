'use strict';

/**
 * @ngdoc directive
 * @name homeydashV3App.directive:mjpeg
 * @description
 * # mjpeg
 */
angular.module('homeydashV3App')
  .directive('mjpeg', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        baseSource: '@'
      },
      replace: true,
      template: '<img style="width:auto;height:100%;" ng-src="{{source}}">',
      link: function(scope, element, attrs) {
        scope.$ready = true;

        (function tick() {
          if (scope.$ready === true) {
            scope.source = scope.baseSource + '?_ud=' + (Date.now() - 60000);
            scope.$ready = false;
          }

          $timeout(tick, 100);
        }());

        element.bind('load', function() {
          //console.log('load');
          scope.$ready = true;
          scope.$apply();
        });
        element.bind('error', function() {
          console.log('error');
          scope.$ready = true;
          scope.$apply();
        });
      }
    };
  });
