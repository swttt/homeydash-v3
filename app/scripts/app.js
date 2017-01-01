'use strict';

/**
 * @ngdoc overview
 * @name homeydashV3App
 * @description
 * # homeydashV3App
 *
 * Main module of the application.
 */
angular
  .module('homeydashV3App', [
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'ngMaterial',
    'ui.router',
    'ngTouch',
    'ngScrollbars'
  ])

.config(function($mdThemingProvider, $mdDialogProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('orange');

    $mdDialogProvider.addPreset('addPage', {
      options: function() {
        return {
          templateUrl: 'views/dialogaddpage.html',
          controller: 'DialogaddpageCtrl',
          autoWrap: false,
          clickOutsideToClose: false,
          escapeToClose: false
        };
      }
    });


  })
  .run(function($rootScope, alldevices, CONFIG, socket, $sce) {

    alldevices().then(function(response) {
      $rootScope.devicelist = response.data.result;
    }).then(function() {
      angular.forEach(CONFIG.pages, function(value, key) {
        angular.forEach(value.widgets, function(value, key) {
          socket.on(value.capability, value.deviceid, function(data) {
            $rootScope.devicelist[value.deviceid].state[value.capability] = data;
            $rootScope.$apply();
          });
        });
      });
    });






  })
  .run(['$rootScope', '$state', function($rootScope, $state) {

    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params, {
          location: 'replace'
        });
      }
    });
  }])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('setup', {
        url: '/setup',
        templateUrl: 'views/setup.html',
        redirectTo: 'setup.general',
      })
      .state('setup.general', {
        url: '/general',
        templateUrl: 'views/setup-general.html',
        data: {
          'selectedTab': 0
        }
      })
      .state('setup.pages', {
        url: '/pages',
        templateUrl: 'views/setup-pages.html',
        data: {
          'selectedTab': 1
        }
      })
      .state('setup.pages.page', {
        url: '/:pagename',
        templateUrl: 'views/setup-widgetsview.html',
        data: {
          'selectedTab': 1
        }
      })

    .state('setup.plugins', {
        url: '/plugins',
        templateUrl: 'views/setup-plugins.html',
        data: {
          'selectedTab': 2
        }
      })
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html'
      })
      .state('main.page', {
        url: 'page/:pagename',
        templateUrl: 'views/device-page.html'
      });

  });

angular.element(document).ready(
  function() {
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    $http.get('config.json').then(
      function(response) {
        var config = response.data;
        // Add additional services/constants/variables to your app,
        // and then finally bootstrap it:
        config.httpconfig = {
          headers: {
            'Authorization': 'Bearer ' + response.data.bearertoken,
            'Content-Type': 'application/json'
          }
        };
        angular.module('homeydashV3App').constant('CONFIG', config);
        angular.module('homeydashV3App').run(function($rootScope, CONFIG) {
          $rootScope.CONFIG = CONFIG;
        });
        console.log(config);
        angular.bootstrap(document, ['homeydashV3App']);
      }
    );
  }
);
