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
      columns: 30,
      colWidth: 'auto',
      rowHeight: 60,
      margins: [10, 10],
      floating: false,
      maxRows: 12,
      defaultSizeX: 1,
      swapping: true,
      mobileModeEnabled: false,
      mobileBreakPoint: 600,
      resizable: {
        enabled: true,
        handles: ['sw', 'se'],
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


    $scope.currentNavItem = $state.params.pagename;
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams) {
        if (!toParams[0]) {
          $scope.currentNavItem = null;
        }
        $scope.currentNavItem = toParams.pagename;

      })
    // Add page
    // CHECK FOR DUPLICATES HERE
    function escapeHtml(text) {
      var map = {
        '&': ' and ',
        '<': '',
        '>': '',
        '"': '',
        "'": ''
      };

      return text.replace(/[&<>"']/g, function(m) {
        return map[m];
      });
    };
    $scope.savePage = function(pagename) {

      // Push to array
      if (pagename) {
        $rootScope.CONFIG.pages.push({
          pagename: escapeHtml(pagename),
          widgets: []
        });
        console.log(escapeHtml(pagename));

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
      } else {
        $mdToast.show(
          $mdToast.simple()
          .textContent('ERROR: ' + 'pagename cannot be empty')
          .position('top right')
        );
      }
    };


    // Save pagename
    $scope.savePagename = function(pageid, newvalue) {
      if (newvalue) {
        $rootScope.CONFIG.pages[pageid].pagename = escapeHtml(newvalue);
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
      } else {
        $mdToast.show(
          $mdToast.simple()
          .textContent('ERROR: ' + 'pagename cannot be empty')
          .position('top right')
        );
      }
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
      handle: '.menudrag',
      axis: 'x',
      'ui-floating': true,
      items: '.sortable-item',

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
        'name': escapeHtml($scope.newWidget.name),
        'icon': $scope.newWidget.icon,
        'widgettype': $scope.newWidget.capability.capability,
        'capability': Object.keys($rootScope.devicelist[$scope.newWidget.device.id].capabilities),
        'deviceid': $scope.newWidget.device.id,
        'class': $scope.newWidget.capability.class,
        'sizeX': $scope.newWidget.capability.width,
        'sizeY': $scope.newWidget.capability.height
      });
      savesettings.save($rootScope.CONFIG).then(function() {
        $scope.closeDialog();
        console.log('New settings saved!');
      });
    };


    $scope.selectedIcon = function(icon) {
      if ($scope.newWidget.icon === icon) {
        return true;
      } else {
        return false;
      }
    }




  });
