'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:DevicesCtrl
 * @description
 * # DevicesCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('DevicesCtrl', function($scope, $rootScope, $mdToast, device, alldevices, debounce, savesettings, $mdDialog) {
    // Delete widget
    $scope.removeWidget = function(widgetid, widget, params) {
      //var index = $rootScope.CONFIG.pages[pagename].indexOf(widgetname);
      //console.log(widget);

      //delete $rootScope.CONFIG.pages[pagename].widgets[widgetid];

      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete widget')
        .textContent('Are you sure you want to delete ' + widget.name + '?')
        .ariaLabel('Delete widget')
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
        // Delete widget
        $rootScope.CONFIG.pages[$scope.getIdbyAtrr($rootScope.CONFIG.pages, 'pagename', params.pagename)].widgets.splice(widgetid, 1);
        savesettings.save($rootScope.CONFIG).then(function(response) {

        }, function(error) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('ERROR: ' + error)
            .position('top right')
          );
        });
      }, function() {
        // Don't delete
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
