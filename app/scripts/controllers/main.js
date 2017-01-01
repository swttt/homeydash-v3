'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('MainCtrl', function($window, $scope, $stateParams, device, socket, alldevices, $rootScope, CONFIG, $sce, $mdToast) {
    $scope.sidebarWidth = 'flex-20';
    $scope.params = $stateParams;


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
        }
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
    }


    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      alldevices().then(function(response) {
        $rootScope.devicelist = response.data.result;
        console.log('Updated devicelist!')
      });
    });

    $scope.socketurl = $sce.trustAsResourceUrl('//' + CONFIG.homeyip + '/socket.io/socket.io.js');

    // Capability commands
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

  });
