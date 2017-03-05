'use strict';

/**
 * @ngdoc function
 * @name homeydashV3App.controller:SetupCtrl
 * @description
 * # SetupCtrl
 * Controller of the homeydashV3App
 */
angular.module('homeydashV3App')
  .controller('SetupCtrl', function($timeout, WizardHandler, $scope, $rootScope, $mdDialog, $mdToast, savesettings, $localStorage, $state, $element) {



    var preventClick = function(e) {
      e.stopPropagation();
      e.preventDefault();
    };
    // Gridster Options for settings
    $scope.gridsterOptsSettings = {
      columns: 30,
      colWidth: 'auto',
      rowHeight: 60,
      margins: [10, 10],
      floating: false,
      pushing: false,
      maxRows: 12,
      defaultSizeX: 1,
      swapping: true,
      mobileModeEnabled: false,
      mobileBreakPoint: 600,
      resizable: {
        enabled: true,
        handles: ['sw', 'se'],
        start: function(event, $element, widget) {
          $element[0].addEventListener('click', preventClick, true);
        },
        stop: function(event, $element, widget) {
          setTimeout(function() {
            $element[0].removeEventListener('click', preventClick, true);
          });
          $scope.saveSettings();
          console.log($rootScope.CONFIG);
        }
      },
      draggable: {
        enabled: true,
        scrollSensitivity: 60,
        scrollSpeed: 5,
        //  handle: '.draghandle',
        start: function(event, $element, widget, widgetinfo) {

        },
        drag: function(event, $element, widget, widgetinfo) {
          $element[0].addEventListener('click', preventClick, true);
        },
        stop: function(event, $element, widget, widgetinfo) {
          setTimeout(function() {
            $element[0].removeEventListener('click', preventClick, true);
          });
          $scope.saveSettings();
        }
      }

    };

    $scope.deleteArray = [];

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      $scope.deleteArray = [];
    });

    $scope.addtodelete = function(id) {
      if ($scope.deleteArray.indexOf(id) === -1) {
        $scope.deleteArray.push(id);
      } else {
        $scope.deleteArray.splice($scope.deleteArray.indexOf(id), 1);
      }
      console.log($scope.deleteArray);
    };

    $scope.markedDelete = function(index) {
      if ($scope.deleteArray.indexOf(index) === -1) {
        return false;
      } else {
        return true;
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
      $scope.newWidget.widgettype = widgettype;
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

    };

    $scope.saveWidget = function(pageid) {


      if ($scope.newWidget.widgettype === 'homeydevices') {
        $rootScope.CONFIG.pages[pageid].widgets.push({
          'name': escapeHtml($scope.newWidget.name),
          'id': getRandomId(),
          'icon': $scope.newWidget.icon,
          'widgettype': $scope.newWidget.capability.capability,
          'capability': Object.keys($rootScope.devicelist[$scope.newWidget.device.id].capabilities),
          'deviceid': $scope.newWidget.device.id,
          'class': $scope.newWidget.capability.class,
          'sizeX': $scope.newWidget.capability.width,
          'sizeY': $scope.newWidget.capability.height
        });
      };

      if ($scope.newWidget.widgettype === 'buienradar') {
        $rootScope.CONFIG.pages[pageid].widgets.push({
          'name': escapeHtml($scope.newWidget.name),
          'id': getRandomId(),
          'widgettype': $scope.newWidget.widgettype,
          'url': $scope.newWidget.url,
          'sizeX': 5,
          'sizeY': 4
        });
      };

      if ($scope.newWidget.widgettype === 'rss') {
        $rootScope.CONFIG.pages[pageid].widgets.push({
          'name': escapeHtml($scope.newWidget.name),
          'id': getRandomId(),
          'widgettype': $scope.newWidget.widgettype,
          'url': $scope.newWidget.url,
          'sizeX': 9,
          'sizeY': 4
        });
      };
      if ($scope.newWidget.widgettype === 'video') {
        $rootScope.CONFIG.pages[pageid].widgets.push({
          'name': escapeHtml($scope.newWidget.name),
          'id': getRandomId(),
          'widgettype': $scope.newWidget.widgettype,
          'url': $scope.newWidget.url,
          'sizeX': 5,
          'sizeY': 4
        });
      };


      savesettings.save($rootScope.CONFIG).then(function() {
        $scope.closeDialog();
        console.log('New settings saved!');
        $scope.newWidget = {};
      });
    };


    $scope.selectedIcon = function(icon) {
      if ($scope.newWidget.icon === icon) {
        return true;
      } else {
        return false;
      }
    }


    //Delete widget
    $scope.removeWidget = function(widgetid, widget, params) {
      //var index = $rootScope.CONFIG.pages[pagename].indexOf(widgetname);
      //console.log(widget);

      //delete $rootScope.CONFIG.pages[pagename].widgets[widgetid];

      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete widget')
        .textContent('Are you sure you want to delete ' + widget.name + '?')
        .ariaLabel('Delete widget')
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
        // Delete widget
        $rootScope.CONFIG.pages[$scope.getIdbyAtrr($rootScope.CONFIG.pages, 'pagename', params.pagename)].widgets.splice(widgetid, 1);
        savesettings.save($rootScope.CONFIG).then(function(response) {
          $scope.deleteArray = [];
        }, function(error) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('ERROR: ' + error)
            .position('top right')
          );
        });
      }, function() {
        // Don't delete
      });
    };

    // Remove selected widgets
    $scope.removeSelectedWidgets = function(params) {
      console.log(params);
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Delete widgets')
        .textContent('Are you sure you want to delete the selected widgets?')
        .ariaLabel('Delete widgets')
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
        // Delete widget

        angular.forEach($scope.deleteArray, function(value) {
          $rootScope.CONFIG.pages[$scope.getIdbyAtrr($rootScope.CONFIG.pages, 'pagename', params.pagename)].widgets.splice($scope.getIdbyAtrr($rootScope.CONFIG.pages[$scope.getIdbyAtrr($rootScope.CONFIG.pages, 'pagename', params.pagename)].widgets, 'id', value), 1);
        });

        $scope.deleteArray = [];

        savesettings.save($rootScope.CONFIG).then(function(response) {

        }, function(error) {
          $mdToast.show(
            $mdToast.simple()
            .textContent('ERROR: ' + error)
            .position('top right')
          );
        });
      }, function() {
        // Don't delete
      });
    };


  });
