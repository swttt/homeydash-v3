'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:DialogaddwidgetCtrl
 * @description
 * # DialogaddwidgetCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('DialogaddwidgetCtrl', function($scope, $rootScope, $mdToast, $mdDialog, savesettings, pageid) {
    //$scope.pagename = $rootScope.CONFIG.pages[pageid].pagename;
    $scope.devicelist = $rootScope.devicelist;




    $scope.saveNewwidgetDialog = function(widgetname, widgetid, capability, pagename) {
      console.log(widgetname, widgetid, capability, pageid);
      $rootScope.CONFIG.pages[pageid].widgets.push({
        "name": widgetname,
        "widgettype": capability,
        "capability": Object.keys($rootScope.devicelist[widgetid].capabilities),
        "deviceid": widgetid
      });
      console.log($rootScope.CONFIG.pages[pageid]);

      savesettings.save($rootScope.CONFIG).then(function(response) {

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
