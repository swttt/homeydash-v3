'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('MainCtrl', function($element, savesettings, $localStorage, $mdSidenav, $window, $scope, $stateParams, device, socket, alldevices, $rootScope, CONFIG, $mdDialog) {

    // Add params to scope
    $scope.params = $stateParams;
    // Add localstorage to scope
    $scope.localStorage = $localStorage;
    // Hide overlay on start (used for dimming)
    $scope.hideOverlay = false;

    if (!$scope.localStorage.GENERAL.widgetbackground) {
      $scope.localStorage.GENERAL.widgetbackground = 'transparant-bg';
    }
    // Set sidebar check for edit mode
    var sidebarLocked;


    // !! SET HOMEYDASH WIDE !!
    // Function to save settings
    $scope.saveSettings = function() {
      savesettings.save($rootScope.CONFIG);
      console.log('New settings saved!');
    };
    // If agreement never is accepted show it again
    if (!localStorage.getItem('agreement')) {
      $mdDialog.show({
          templateUrl: 'views/dialogs/agreement.html',
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
    //Normal page
    var windowHeight = $window.innerHeight - 62;
    var widgetHeight = 60;
    var maxWidgets = Math.floor(windowHeight / widgetHeight);
    var totalExtraHeight = windowHeight - Math.floor(windowHeight / widgetHeight);
    var totalWidgetHeight = maxWidgets + (totalExtraHeight / maxWidgets) - 5;

    //Direct page
    var windowHeightDirect = $window.innerHeight - 2;
    var widgetHeightDirect = 60;
    var maxWidgetsDirect = Math.floor(windowHeightDirect / widgetHeightDirect);
    var totalExtraHeightDirect = windowHeightDirect - Math.floor(windowHeightDirect / widgetHeightDirect);
    var totalWidgetHeightDirect = maxWidgetsDirect + (totalExtraHeightDirect / maxWidgetsDirect) - 5;

    // Gridster options normal page
    $scope.gridsterOpts = {
      columns: 30,
      colWidth: 'auto',
      rowHeight: totalWidgetHeight,
      margins: [10, 10],
      floating: false,
      maxRows: maxWidgetsDirect,
      defaultSizeX: 1,
      swapping: true,
      mobileModeEnabled: true,
      mobileBreakPoint: 600,
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false,
        scrollSensitivity: 60,
        scrollSpeed: 5,
        //  handle: '.draghandle',
        start: function(event, $element, widget) {},
        drag: function(event, $element, widget) {},
        stop: function(event, $element, widget) {}
      }

    };

    // Gridster options direct page
    $scope.gridsterOptsDirect = {
      columns: 30,
      colWidth: 'auto',
      rowHeight: totalWidgetHeightDirect,
      margins: [10, 10],
      floating: false,
      maxRows: maxWidgets,
      defaultSizeX: 1,
      swapping: true,
      mobileModeEnabled: true,
      mobileBreakPoint: 600,
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: false,
        scrollSensitivity: 60,
        scrollSpeed: 5,
        //  handle: '.draghandle',
        start: function(event, $element, widget) {},
        drag: function(event, $element, widget) {},
        stop: function(event, $element, widget) {}
      }

    };









    // Function to switch sidebar
    $scope.switchSidebar = function() {
      $mdSidenav('left').toggle();
    };

    // Function to get id by attribute
    $scope.getIdbyAtrr = function(array, attr, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    };



    // Check if there are pages presented
    if (Object.keys($rootScope.CONFIG.pages).length === 0) {
      $scope.noPages = true;
    } else {
      $scope.noPages = false;
    }

    // Calculate sidebar size
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

    // Body scroll config
    $scope.bodyconfig = {
      autoHideScrollbar: true,
      theme: 'minimal-dark'
    };

    // Update devicelist on state change
    $rootScope.$on('$stateChangeStart', function() {
      alldevices().then(function(response) {
        $rootScope.devicelist = response.data.result;
        console.log('Updated devicelist!');
      });
    });





  });
