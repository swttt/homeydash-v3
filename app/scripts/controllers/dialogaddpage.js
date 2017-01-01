'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:DialogaddpageCtrl
 * @description
 * # DialogaddpageCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('DialogaddpageCtrl', function($scope, $rootScope, $mdToast, $mdDialog, savesettings) {

    $scope.saveNewpageDialog = function(pagename) {

      $rootScope.CONFIG.pages[pagename] = {};
      $rootScope.CONFIG.pages[pagename].widgets = [];

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


    $scope.closeNewpageDialog = function() {
      $mdDialog.cancel();
    };
  });
