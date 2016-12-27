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
    'ui.router'
  ])

.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('orange');
  })
  .run(function($rootScope, alldevices, $timeout) {



    var devicesTimeout = function() {
      alldevices().then(function(response) {
        $rootScope.devicelist = {};
        $rootScope.devicelist = response.data.result;
      });
      $timeout(devicesTimeout, 300);
    };
    $timeout(devicesTimeout, 300);



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
      .state('setup.widgets', {
        url: '/widgets',
        templateUrl: 'views/setup-widgets.html',
        data: {
          'selectedTab': 2
        }
      })
      .state('setup.plugins', {
        url: '/plugins',
        templateUrl: 'views/setup-plugins.html',
        data: {
          'selectedTab': 3
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
