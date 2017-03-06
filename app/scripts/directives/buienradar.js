'use strict';

/**
 * @ngdoc directive
 * @name homeydashV3App.directive:buienradar
 * @description
 * # buienradar
 */
angular.module('homeydashV3App')
  .directive('buienradar', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        url: '@'
      },
      replace: true,
      template: '<img style="width:100%;height:100%;" ng-src="{{source}}">',
      link: function(scope, element, attrs) {
        scope.$ready = true;

        (function tick() {
          if (scope.$ready === true) {
            scope.source = scope.url + '?_ud=' + (Date.now() - 60000);
            scope.$ready = false;
          }

          $timeout(tick, 600000);
        }());

        element.bind('load', function() {
          console.log('buienradar update');
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
