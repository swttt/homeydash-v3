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

    // Set localStorage
    $scope.storage = $localStorage;

    // Widget wizard
    $scope.newWidget = {};
    $scope.isEmpty = function(obj, key) {
      if (obj.hasOwnProperty(key)) return true;
    };


    $scope.filterDevices = function(items, property) {
      var result = {};
      angular.forEach(items, function(value, key) {
        if (value.capabilities.hasOwnProperty(property)) {
          result[key] = value;
        }
      });
      return result;
    };

    //
    console.log();
    // Remove widget
    $scope.removeWidget = function(params) {
      //var index = $rootScope.CONFIG.pages[pagename].indexOf(widgetname);
      console.log(params);
      $rootScope.CONFIG.pages[$scope.getIdbyAtrr($rootScope.CONFIG.pages, 'pagename', params.pagename)].widgets.splice(params.widgetid, 1);
      //delete $rootScope.CONFIG.pages[pagename].widgets[widgetid];
      //console.log($rootScope.CONFIG.pages[pagename]);

      savesettings.save($rootScope.CONFIG).then(function(response) {
        $state.go('setup.pages.page', {
          pagename: $state.params.pagename
        }, {
          reload: true,
          inherit: false,
          notify: true
        });
      }, function(error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('ERROR: ' + error)
          .position('top right')
        );
      });
    };

    // Add widget to page
    $scope.saveWidget = function(pageid) {
      $rootScope.CONFIG.pages[pageid].widgets.push({
        "name": $scope.newWidget.device.name,
        "widgettype": $scope.newWidget.capability.capability,
        "capability": Object.keys($rootScope.devicelist[$scope.newWidget.device.id].capabilities),
        "deviceid": $scope.newWidget.device.id,
        "class": $scope.newWidget.capability.class
      });
      savesettings.save($rootScope.CONFIG).then(function() {
        $state.go('setup.pages.page', {
          pagename: $state.params.pagename
        }, {
          reload: true,
          inherit: false,
          notify: true
        });
        console.log('New settings saved!');
      });
    };

    // Function to get array index
    $scope.getIdbyAtrr = function(array, attr, value) {
      for (var i = 0; i < array.length; i++) {
        if (array[i].hasOwnProperty(attr) && array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    };



    // Get the tabs right
    $scope.$on('$stateChangeSuccess', function(event, toState) {
      $scope.currentTab = toState.data.selectedTab;
    });

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
        $state.go('setup.pages');
      }, function(error) {
        $mdToast.show(
          $mdToast.simple()
          .textContent('ERROR: ' + error)
          .position('top right')
        );
      });
    };


    // Save settings
    $scope.saveSettings = function() {
      savesettings.save($rootScope.CONFIG);
      console.log('New settings saved!');
    };

    // Save pagename
    $scope.savePagename = function(pageid, newvalue) {
      $rootScope.CONFIG.pages[pageid].pagename = newvalue;
      savesettings.save($rootScope.CONFIG).then(function() {
        $state.go('setup.pages.page', {
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
      $state.go('setup.pages');
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
      },
      axis: 'y'

    };

    // Settings for widgets DnD
    $scope.sortableOptionsWidgets = {
      update: function(e, ui) {
        savesettings.save($rootScope.CONFIG);
      }
    };



    $scope.addwidget = function(pageid) {
      $mdDialog.show({
        templateUrl: 'views/dialogaddwidget.html',
        controller: 'DialogaddwidgetCtrl',
        autoWrap: false,
        clickOutsideToClose: true,
        escapeToClose: false,
        locals: {
          pageid: pageid
        }
      });
    };

    $scope.deleteWidget = function(pagename, widgetname, widgetid, pageid) {
      console.log(pagename, widgetname, widgetid, pageid);
      $mdDialog.show({
        templateUrl: 'views/dialogremovewidget.html',
        controller: 'DialogremovewidgetCtrl',
        autoWrap: false,
        clickOutsideToClose: true,
        locals: {
          pageid: pageid,
          pagename: pagename,
          widgetname: widgetname,
          widgetid: widgetid
        }
      });



    };





  });
