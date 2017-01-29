'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('MainCtrl', function($localStorage, $mdSidenav, Idle, $window, $scope, $stateParams, device, socket, alldevices, $rootScope, CONFIG, $sce, $mdToast, $mdDialog) {
    $scope.params = $stateParams;

    if (!localStorage.getItem('agreement')) {
      $mdDialog.show({
          templateUrl: 'views/agreement.html',
          clickOutsideToClose: false,
          fullscreen: true,
          controller: 'AgreementCtrl',
          hasBackdrop: false,
          escapeToClose: false
        })
        .then(function() {
          localStorage.setItem('agreement', true);
        });

    }



    $scope.localStorage = $localStorage;

    $scope.hideOverlay = false;
    $scope.$on('IdleStart', function() {
      // the user appears to have gone idle
      $scope.hideOverlay = true;
      $scope.$apply();
    });

    $scope.$on('IdleEnd', function() {
      // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
      $scope.hideOverlay = false;
      $scope.$apply();
    });

    $scope.switchSidebar = function() {
      $mdSidenav('left').toggle();

    };


    $scope.getIdbyAtrr = function(array, attr, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    };




    if (Object.keys($rootScope.CONFIG.pages).length === 0) {
      $scope.noPages = true;
    } else {
      $scope.noPages = false;
    }

    var sidebarsize = $window.innerHeight - 110;
    $(window).resize(function() {
      sidebarsize = $window.innerHeight - 110;

      $scope.$apply(function() {
        $scope.config = {
          autoHideScrollbar: false,
          theme: 'minimal-dark',
          advanced: {
            updateOnContentResize: true
          },
          setHeight: sidebarsize,
          scrollInertia: 0
        };
      });
    });
    $scope.config = {
      autoHideScrollbar: false,
      theme: 'minimal-dark',
      advanced: {
        updateOnContentResize: true
      },
      setHeight: sidebarsize,
      scrollInertia: 0
    };


    $rootScope.$on('$stateChangeStart', function() {
      alldevices().then(function(response) {
        $rootScope.devicelist = response.data.result;
        console.log('Updated devicelist!');
      });
    });




  });
