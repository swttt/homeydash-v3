'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('MainCtrl', function($scope, $stateParams, device, $rootScope) {
    $scope.sidebarWidth = 'flex-20';
    $scope.params = $stateParams;

    $scope.click = function(currentId, cmd) {
      if (cmd) {
        device.onoff(currentId, false).then(function() {
          $rootScope.devicelist[currentId].state.onoff = false;
        });
      } else {
        device.onoff(currentId, true).then(function() {
          $rootScope.devicelist[currentId].state.onoff = true;
        });
      }

    };

  });
