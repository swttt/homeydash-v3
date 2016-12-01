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

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'partial-home.html'
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
        console.log(config);
        angular.bootstrap(document, ['homeydashV3App']);
      }
    );
  }
);
