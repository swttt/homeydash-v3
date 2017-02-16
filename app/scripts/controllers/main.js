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

    // Set editMode false on start
    $scope.editMode = false;

    // Add localstorage to scope
    $scope.localStorage = $localStorage;

    // Hide overlay on start (used for dimming)
    $scope.hideOverlay = false;

    // Set sidebar check for edit mode
    var sidebarLocked;


    // Function to save settings
    $scope.saveSettings = function() {
      savesettings.save($rootScope.CONFIG);
      console.log('New settings saved!');
    };


    // Body scroller settings (mostly needed for iOS scrolling in gridster mobile mode)
    $scope.bodyscroll = {
      autoHideScrollbar: true,
      theme: 'minimal-dark',
      scrollInertia: 300,
      advanced: {
        updateOnContentResize: true
      }
    };




    // Gridster options
    $scope.gridsterOpts = {
      columns: 4,
      colWidth: 'auto',
      rowHeight: 150,
      margins: [20, 20],
      floating: false,
      maxRows: 12,
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
        start: function(event, $element, widget) {}, //
        drag: function(event, $element, widget) {
          //console.log($element);

          var divHeight = $('#mCSB_5_container').height();
          var gridTop = $('#mCSB_5_container').cssNumber('top');
          var itemTop = $element[0].offsetTop;
          var offsetfromTop = itemTop + gridTop;
          var offsetCorrect = offsetfromTop + 165;

          // if (offsetCorrect > $('body').height()) {
          //   var scrollTo = $('#mCSB_5_container').cssNumber("top") - 40;
          //   $('#mCSB_5_container').css("top", scrollTo);
          //   console.log('scrolled to' + scrollTo);
          // }

        },
        stop: function(event, $element, widget) {
          $scope.saveSettings();
        }
      }

    };


    // Function to switch edit mode
    $scope.switchEdit = function() {
      if ($scope.editMode) {
        $scope.gridsterOpts.draggable.enabled = false;
        $scope.editMode = false;
      } else if (!$scope.editMode) {
        $scope.editMode = true;
        $scope.gridsterOpts.draggable.enabled = true;
      }
    };


    // If agreement never is accepted show it again
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

    // Update devicelist on state change
    $rootScope.$on('$stateChangeStart', function() {
      alldevices().then(function(response) {
        $rootScope.devicelist = response.data.result;
        console.log('Updated devicelist!');
      });
    });


    // Open add widget dialog
    $scope.addWidget = function() {

      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        templateUrl: 'views/dialog-addwidget.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      });
    };




  });
