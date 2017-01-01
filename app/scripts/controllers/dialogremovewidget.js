'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:DialogremovewidgetCtrl
 * @description
 * # DialogremovewidgetCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('DialogremovewidgetCtrl', function($scope, $rootScope, $mdToast, $mdDialog, savesettings, widgetname, pagename, widgetid) {

    $scope.widgetname = widgetname;
    $scope.pagename = pagename;
    $scope.widgetid = widgetid;

    $scope.removeWidgetDialog = function() {
      //var index = $rootScope.CONFIG.pages[pagename].indexOf(widgetname);
      $rootScope.CONFIG.pages[pagename].widgets.splice(widgetid, 1);
      //delete $rootScope.CONFIG.pages[pagename].widgets[widgetid];
      console.log($rootScope.CONFIG.pages[pagename]);
      savesettings.save($rootScope.CONFIG).then(function(response) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Widget removed!')
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

    $scope.closeWidgetDialog = function() {
      $mdDialog.cancel();
    };
  });
