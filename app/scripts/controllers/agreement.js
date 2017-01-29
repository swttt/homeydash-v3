'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:AgreementCtrl
 * @description
 * # AgreementCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('AgreementCtrl', function($scope, $mdDialog) {
    $scope.agree = function() {
      $mdDialog.hide();
    };
  });
