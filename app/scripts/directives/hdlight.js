'use strict';

/**
 * @ngdoc directive
 * @name homeydashV3App.directive:hdLight
 * @description
 * # hdLight
 */
angular.module('homeydashV3App')
  .directive('hdLight', function() {
    return {
      templateUrl: '../views/hdlight.html',
      restrict: 'E',
      scope: {
        type: '@hdType'
      }
    };
  });
