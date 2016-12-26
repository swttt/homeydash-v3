'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:SetupCtrl
 * @description
 * # SetupCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('SetupCtrl', function($scope) {

    $scope.$on('$stateChangeSuccess', function(event, toState) {
      $scope.currentTab = toState.data.selectedTab;
    });

    //Get list of pages with widgets



  });
