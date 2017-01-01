'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:SetupCtrl
 * @description
 * # SetupCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('SetupCtrl', function($scope, $rootScope, $mdDialog, $mdToast, savesettings) {

    // Get the tabs right
    $scope.$on('$stateChangeSuccess', function(event, toState) {
      $scope.currentTab = toState.data.selectedTab;
    });

    // Add page
    // CHECK FOR DUPLICATES HERE
    $scope.addpage = function() {
      $mdDialog.show(
        $mdDialog.addPage()
      );
    };

    $scope.saveSettings = function() {
      savesettings.save($rootScope.CONFIG);
      console.log('New settings saved!');
    };



    // Delete page
    // REMEMBER TO CHECK FOR PAGE NAME BEING UNIQUE ON SAVE!
    $scope.delete = function(pagename, ev) {
      $mdDialog.show({
        templateUrl: 'views/dialogremovepage.html',
        controller: 'DialogremovepageCtrl',
        autoWrap: false,
        clickOutsideToClose: false,
        locals: {
          pagename: pagename
        },
      });
    };

    $scope.addwidget = function(pagename) {
      $mdDialog.show({
        templateUrl: 'views/dialogaddwidget.html',
        controller: 'DialogaddwidgetCtrl',
        autoWrap: false,
        clickOutsideToClose: false,
        escapeToClose: false,
        locals: {
          pagename: pagename
        }
      });
    };

    $scope.deleteWidget = function(pagename, widgetname, widgetid) {
      console.log(pagename, widgetname, widgetid);
      $mdDialog.show({
        templateUrl: 'views/dialogremovewidget.html',
        controller: 'DialogremovewidgetCtrl',
        autoWrap: false,
        clickOutsideToClose: false,
        locals: {
          pagename: pagename,
          widgetname: widgetname,
          widgetid: widgetid
        }
      });



    };





  });
