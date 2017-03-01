'use strict';



jQuery.fn.cssNumber = function(prop) {
  var v = parseInt(this.css(prop), 10);
  return isNaN(v) ? 0 : v;
};

var httpconfig = {
  headers: {
    'Authorization': 'Bearer da3110b6042fae4bd73713189240fc8c797da0c7',
    'Content-Type': 'application/json'
  }
};


// Bootstrap angular and run
function createCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + value + expires + '; path=/';
}

if (localStorage.getItem('bearer_token')) {
  createCookie('bearer_token', localStorage.getItem('bearer_token'), 7);
}

console.log('Bearer found! ' + localStorage.getItem('bearer_token'));

function fetchData() {
  var initInjector = angular.injector(['ng', 'ngStorage']);
  var $http = initInjector.get('$http');
  var $window = initInjector.get('$window');
  var $localStorage = initInjector.get('$localStorage');

  return $http.get('http://192.168.2.72/api/app/com.swttt.homeydash/config.json').then(function(response) {
    var config = response.data.result;
    // Add additional services/constants/variables to your app,
    // and then finally bootstrap it:

    //RESULT TOEVOEGEN NA DATA EN DE CONFIG URL CO


    if (config.forcepersist) {
      localStorage.setItem('bearer_token', response.data.result.bearertoken);
    } else {
      localStorage.setItem('bearer_token', null);
    }



    //$localStorage.httpHeaders = config.httpconfig;
    angular.module('homeydashV3App').constant('CONFIG', config);
    angular.module('homeydashV3App').run(function($rootScope, CONFIG) {
      $rootScope.CONFIG = CONFIG;
    });
    console.log(config);
  }, function(errorResponse) {
    if (errorResponse.status === 401) {
      console.log(errorResponse);
      $window.location.href = 'http://192.168.2.72/manager/users/?redirect_uri=%2Fapp%2Fcom.swttt.homeydash%2F';
    }
    if (errorResponse.status === 403) {
      console.log(errorResponse);
      $window.location.href = 'http://192.168.2.72/manager/users/?redirect_uri=%2Fapp%2Fcom.swttt.homeydash%2F';
    }
  });
}

function bootstrapApplication() {
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['homeydashV3App']);
  });
}

fetchData().then(bootstrapApplication);

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
    'ngScrollbars',
    'ngStorage',
    'mgo-angular-wizard',
    'rt.debounce',
    'gridster',
    'ui.sortable'
  ])

  // Only used for LOCAL!
  // .run(['$http', function($http) {
  //   $http.defaults.headers.common['Authorization'] = 'Bearer da3110b6042fae4bd73713189240fc8c797da0c7';
  //   $http.defaults.headers.common['Content-Type'] = 'application/json';
  //
  // }])


  .run(function($rootScope, alldevices, CONFIG, socket, wallpaper, $http) {
    // Get current wallpaper
    wallpaper().then(function(response) {
      $rootScope.wallpaper = response.data.result.properties.wallpaper;
      $.backstretch('http://192.168.2.72/manager/personalization/wallpapers/' + response.data.result.properties.wallpaper);
    }, function(error) {
      $.backstretch('http://192.168.2.72/manager/personalization/wallpapers/system/homey.jpg');
    });

    // Get settings.json and put into rootScope
    $http.get('setup.json').then(function(response) {
      $rootScope.SETUP = response.data;
    }, function(err) {
      console.log(err);
    });

    // Set socket.io
    alldevices().then(function(response) {
      $rootScope.devicelist = response.data.result;
    }).then(function() {
      angular.forEach(CONFIG.pages, function(pagesvalue) {
        angular.forEach(pagesvalue.widgets, function(widgetsvalue) {
          angular.forEach(widgetsvalue.capability, function(capabilityvalue) {
            socket.on(capabilityvalue, widgetsvalue.deviceid, function(data) {
              $rootScope.devicelist[widgetsvalue.deviceid].state[capabilityvalue] = data;
              $rootScope.$apply();
            });
          });
        });
      });
    });
  })

  .config(function($mdThemingProvider, $mdIconProvider) {

    var themes = [
      "red",
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "blue",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "lime",
      "yellow",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "grey",
      "blue-grey"
    ];

    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('blue-grey');

    angular.forEach(themes, function(theme) {
      $mdThemingProvider.theme(theme)
        .primaryPalette(theme)
        .accentPalette(theme);
    });
    $mdThemingProvider.alwaysWatchTheme(true);

    $mdIconProvider
      .iconSet('fa');
  })
  .filter('numberEx', ['numberFilter', '$locale',
    function(number, $locale) {

      var formats = $locale.NUMBER_FORMATS;
      return function(input, fractionSize) {
        //Get formatted value
        var formattedValue = number(input, fractionSize);

        //get the decimalSepPosition
        var decimalIdx = formattedValue.indexOf(formats.DECIMAL_SEP);

        //If no decimal just return
        if (decimalIdx == -1) return formattedValue;


        var whole = formattedValue.substring(0, decimalIdx);
        var decimal = (Number(formattedValue.substring(decimalIdx)) || "").toString();

        return whole + decimal.substring(1);
      };
    }
  ])
  .run(['$rootScope', '$state', '$localStorage', function($rootScope, $state, $localStorage) {
    if (!$localStorage.defaultPage) {
      $localStorage.defaultPage = false;
    }
    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params, {
          location: 'replace'
        });
      }
      if (to.name === 'main.page') {

        if (!$rootScope.CONFIG.pages.filter(function(e) {
            return e.pagename === params.pagename;
          }).length) {
          evt.preventDefault();
          console.log('Page not found!');
          $state.go('main');
        }
      }
      if (to.name === 'setup.page') {

        if (!$rootScope.CONFIG.pages.filter(function(e) {
            return e.pagename === params.pagename;
          }).length) {
          evt.preventDefault();
          console.log('Page not found!');
          $state.go('setup');
        }
      }
      if (to.name === 'main') {
        if ($localStorage.defaultPage && $rootScope.CONFIG.pages.filter(function(e) {
            return e.pagename === $localStorage.defaultPage;
          }).length) {
          evt.preventDefault();
          console.log('default page found');
          $state.go('main.page', {
            pagename: $localStorage.defaultPage
          }, {
            location: 'replace'
          });
        }
      }
    });
  }])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('setup', {
        url: '/settings',
        templateUrl: 'views/setup.html',
        controller: 'SetupCtrl'
      })
      .state('setup.generalsettings', {
        url: '/general',
        templateUrl: 'views/setup/generalsettings.html'
      })
      .state('setup.page', {
        url: '/:pagename',
        templateUrl: 'views/setup/page.html'
      })
      .state('setup.plugins', {
        url: '/plugins',
        templateUrl: 'views/setup-plugins.html'
      })
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html'
      })
      .state('main.page', {
        url: ':pagename',
        templateUrl: 'views/device-page.html'
      })
      .state('directpage', {
        url: '/direct/:pagename',
        templateUrl: 'views/direct-page.html'
      });

  });
