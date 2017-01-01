'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:DialogaddwidgetCtrl
 * @description
 * # DialogaddwidgetCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('DialogaddwidgetCtrl', function($scope, $rootScope, $mdToast, $mdDialog, savesettings, pagename) {
    $scope.pagename = pagename;
    $scope.devicelist = $rootScope.devicelist;




    $scope.saveNewwidgetDialog = function(widgetname, widgetid, capability, pagename) {
      console.log(widgetname, widgetid, capability, pagename);
      $rootScope.CONFIG.pages[pagename].widgets.push({
        "name": widgetname,
        "capability": capability,
        "deviceid": widgetid
      });
      console.log($rootScope.CONFIG.pages[pagename]);

      savesettings.save($rootScope.CONFIG).then(function(response) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Page saved!')
          .position('top right')
        );
      }, function(error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('ERROR: ' + error)
          .position('top right')
        );
      });
      $mdDialog.hide();
    };


    $scope.closeNewwidgetDialog = function() {
      $mdDialog.cancel();
    };
  });
