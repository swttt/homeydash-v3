'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('MainCtrl', function($scope, $stateParams, device) {
    $scope.sidebarWidth = 'flex-20';
    $scope.params = $stateParams;

    $scope.click = function(currentId, cmd) {
      if (cmd) {
        device.onoff(currentId, false);
      } else {
        device.onoff(currentId, true);
      }


    };

  });
