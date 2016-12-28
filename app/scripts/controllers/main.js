'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('MainCtrl', function($scope, $stateParams, device, socket, alldevices, $rootScope, CONFIG, $sce) {
    $scope.sidebarWidth = 'flex-20';
    $scope.params = $stateParams;

    $scope.click = function(currentId, cmd) {
      if (cmd) {
        device.onoff(currentId, false);
      } else {
        device.onoff(currentId, true);
      }
    };


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      alldevices().then(function(response) {
        $rootScope.devicelist = response.data.result;
        console.log('Updated devicelist!')
      });
    });

    $scope.socketurl = $sce.trustAsResourceUrl('//' + CONFIG.homeyip + '/socket.io/socket.io.js');



  });
