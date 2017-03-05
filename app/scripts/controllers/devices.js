'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:DevicesCtrl
 * @description
 * # DevicesCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('DevicesCtrl', function($timeout, $scope, $rootScope, $mdToast, device, alldevices, debounce, savesettings, $mdDialog) {

    //Buienradar refresh
    if ($scope.widget.url) {
      console.log('Buienradar url found!');
      updateBuienradar();

      function updateBuienradar() {
        $timeout(function() {
          $scope.widget.url = $scope.widget.url + '?_lastupdate=' + new Date().getTime();
          console.log('updated: ' + $scope.widget.name);
          updateBuienradar();
        }, 600000);
      };
    }




    $scope.showFeedItem = function(itemPass) {

      $mdDialog.show({
        templateUrl: 'views/widgets/feedDialog.html',
        clickOutsideToClose: true,
        preserveScope: true,
        locals: {
          item: itemPass
        },
        controller: ['$scope', 'item', '$mdDialog', function($scope, item, $mdDialog) {
          $scope.item = item;
          $scope.closeDialog = function() {
            console.log('closing dialog!');
            $mdDialog.cancel();
          };
        }]
      });


    };


    // Button Control
    $scope.button = function(currentId) {
      device.button(currentId).then(function(response) {

      }, function(error) {
        if (error) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('ERROR: ' + error.statusText)
            .position('top right')
            .hideDelay(3000)
          );
        };
      });
    };

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
