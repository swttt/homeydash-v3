'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:DialogremovepageCtrl
 * @description
 * # DialogremovepageCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('DialogremovepageCtrl', function($scope, $rootScope, $mdToast, $mdDialog, savesettings, pagename) {
    $scope.pagename = pagename;
    $scope.removePageDialog = function(pagename) {
      delete $rootScope.CONFIG.pages[pagename];

      savesettings.save($rootScope.CONFIG).then(function(response) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('Page removed!')
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

    $scope.closePageDialog = function() {
      $mdDialog.cancel();
    };
  });
