'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:DevicesCtrl
 * @description
 * # DevicesCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('DevicesCtrl', function($scope, $rootScope, $mdToast, device, alldevices, debounce) {

    // ON OFF Control
    $scope.onoff = function(currentId, cmd) {
      if (cmd) {
        device.onoff(currentId, false).then(function(response) {

        }, function(error) {
          if (error) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('ERROR: ' + error.statusText)
              .position('top right')
              .hideDelay(3000)
            );
            $rootScope.devicelist[currentId].state.onoff = true;
          };
        });
      } else {
        device.onoff(currentId, true).then(function(response) {

        }, function(error) {
          if (error) {
            $mdToast.show(
              $mdToast.simple()
              .textContent('ERROR: ' + error.statusText)
              .position('top right')
              .hideDelay(3000)
            );
            $rootScope.devicelist[currentId].state.onoff = false;
          };
        });
      }
    };

    // Dim Control
    $scope.dim = debounce(250, function(currentId, dimlvl) {
      device.dim(currentId, dimlvl).then(function(response) {}, function(error) {
        if (error) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('ERROR: ' + error.statusText)
            .position('top right')
            .hideDelay(3000)
          );
          alldevices().then(function(response) {
            $rootScope.devicelist = response.data.result;
            console.log('Updated devicelist!')
          });
        };
      });
    })

  });
