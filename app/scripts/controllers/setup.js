'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:SetupCtrl
 * @description
 * # SetupCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('SetupCtrl', function(WizardHandler, $scope, $rootScope, $mdDialog, $mdToast, savesettings, $localStorage, $state, $element) {

    // Gridster Options for settings
    $scope.gridsterOptsSettings = {
      columns: 4,
      colWidth: 'auto',
      rowHeight: 150,
      margins: [20, 20],
      floating: false,
      maxRows: 12,
      defaultSizeX: 1,
      swapping: true,
      mobileModeEnabled: false,
      mobileBreakPoint: 600,
      resizable: {
        enabled: false
      },
      draggable: {
        enabled: true,
        scrollSensitivity: 60,
        scrollSpeed: 5,
        //  handle: '.draghandle',
        start: function(event, $element, widget) {}, //
        drag: function(event, $element, widget) {},
        stop: function(event, $element, widget) {
          $scope.saveSettings();
          console.log($rootScope.CONFIG);
        }
      }

    };


    // Set localStorage
    $scope.storage = $localStorage;

    // Widget wizard
    $scope.newWidget = {};
    $scope.isEmpty = function(obj, key) {
      if (obj.hasOwnProperty(key)) return true;
    };

    // Filter functions for add device wizard
    $scope.filterDevices = function(items, property) {
      var result = {};
      angular.forEach(items, function(value, key) {
        if (value.capabilities.hasOwnProperty(property)) {
          result[key] = value;
        }
      });
      return result;
    };



    // Add page
    // CHECK FOR DUPLICATES HERE

    $scope.savePage = function(pagename) {

      // Push to array
      $rootScope.CONFIG.pages.push({
        pagename: pagename,
        widgets: []
      });

      // Save settings
      savesettings.save($rootScope.CONFIG).then(function(response) {
        $state.go('setup');
      }, function(error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('ERROR: ' + error)
          .position('top right')
        );
      });
    };


    // Save pagename
    $scope.savePagename = function(pageid, newvalue) {
      $rootScope.CONFIG.pages[pageid].pagename = newvalue;
      savesettings.save($rootScope.CONFIG).then(function() {
        $state.go('setup.page', {
          pagename: newvalue
        }, {
          reload: true,
          inherit: false,
          notify: true
        });
        console.log('New settings saved!');
      });
    };

    // Delete page
    $scope.deletePage = function(pageid) {
      $rootScope.CONFIG.pages.splice(pageid, 1);
      $state.go('setup');
      savesettings.save($rootScope.CONFIG).then(function(response) {


      }, function(error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('ERROR: ' + error)
          .position('top right')
        );
      });
    };

    // Settings for pages DnD
    $scope.sortableOptionsPages = {
      handle: '.orderPages',
      update: function(e, ui) {
        savesettings.save($rootScope.CONFIG);
      }

    };

    // Open add widget dialog
    $scope.openAddwidgetDialog = function(widgettype) {

      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        templateUrl: 'views/addwidget-dialogs/' + widgettype + '.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true
      });

    };

    $scope.openAddpageDialog = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
        .title('What would you name your page?')
        .textContent('Please provide a name for your new page.')
        .placeholder('Page name')
        .ariaLabel('Page name')
        .targetEvent(ev)
        .ok('Save')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        $scope.savePage(result);
      }, function() {
        console.log('Canceled page add');
      });
    };

    $scope.openRenamepageDialog = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.prompt()
        .title('What would you name your page?')
        .placeholder('Page name')
        .initialValue($state.params.pagename)
        .ariaLabel('Page name')
        .targetEvent(ev)
        .ok('Save')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function(result) {
        $scope.savePagename($scope.getIdbyAtrr($rootScope.CONFIG.pages, 'pagename', $state.params.pagename), result);
      }, function() {
        console.log('Canceled page name edit');
      });
    };

    $scope.confirmPageDelete = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete page')
        .textContent('Are you sure you want to delete the page ' + $state.params.pagename + '?')
        .ariaLabel('Delete page')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
          $scope.deletePage($scope.getIdbyAtrr($rootScope.CONFIG.pages, 'pagename', $state.params.pagename));
        },
        function() {
          console.log('Delete page canceled');
        });
    };

    $scope.closeDialog = function() {
      $mdDialog.hide();
      $scope.newWidget = {};
    };

    $scope.saveWidget = function(pageid) {
      $rootScope.CONFIG.pages[pageid].widgets.push({
        'name': $scope.newWidget.device.name,
        'widgettype': $scope.newWidget.capability.capability,
        'capability': Object.keys($rootScope.devicelist[$scope.newWidget.device.id].capabilities),
        'deviceid': $scope.newWidget.device.id,
        'class': $scope.newWidget.capability.class
      });
      savesettings.save($rootScope.CONFIG).then(function() {
        $scope.closeDialog();
        console.log('New settings saved!');
      });
    };







  });
