'use strict';


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



function fetchData() {
  var initInjector = angular.injector(['ng', 'ngStorage']);
  var $http = initInjector.get('$http');
  var $window = initInjector.get('$window');
  var $localStorage = initInjector.get('$localStorage');

  return $http.get('http://192.168.2.72/api/app/com.swttt.homeydash/config.json', httpconfig).then(function(response) {
    var config = response.data.result;
    // Add additional services/constants/variables to your app,
    // and then finally bootstrap it:

    //RESULT TOEVOEGEN NA DATA EN DE CONFIG URL CO


    if (config.forcepersist) {
      localStorage.setItem('bearer_token', response.data.result.bearertoken);
    } else {
      localStorage.setItem('bearer_token', null);
    }

    if (config.general.idletime === 'undefined') {
      console.log('no idletime found');
      config.general.idletime = 5;
    }

    //$localStorage.httpHeaders = config.httpconfig;
    angular.module('homeydashV3App').constant('CONFIG', config);
    angular.module('homeydashV3App').run(function($rootScope, CONFIG) {
      $rootScope.CONFIG = CONFIG;
    });
    console.log(config);
  }, function(errorResponse) {
    if (errorResponse.status === 401) {
      $window.location.href = 'http://192.168.2.72/manager/users/?redirect_uri=%2Fapp%2Fcom.swttt.homeydash%2F';
    }
    if (errorResponse.status === 403) {
      delete $localStorage.httpHeaders;
      $window.location.reload();
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
    'ngIdle',
    'ui.sortable',
    'angularInlineEdit',
    'mgo-angular-wizard',
    'rt.debounce'
  ])

.config(function($mdThemingProvider, IdleProvider, KeepaliveProvider, CONFIG) {

    if (CONFIG.general.idletime) {
      IdleProvider.idle(CONFIG.general.idletime);
    }



    IdleProvider.timeout(false);

    $mdThemingProvider.theme('default')
      .primaryPalette('orange')
      .accentPalette('orange');





  })
  .run(['$http', function($http) {
    $http.defaults.headers.common['Authorization'] = 'Bearer da3110b6042fae4bd73713189240fc8c797da0c7';
    $http.defaults.headers.common['Content-Type'] = 'application/json';

  }])

.run(function($rootScope, alldevices, CONFIG, socket, $sce, $mdDialog, Idle, wallpaper, $http) {





    // Check if idle is set
    if (CONFIG.general.idletime) {
      Idle.watch();
    }

    // Get current wallpaper
    wallpaper().then(function(response) {
      $rootScope.wallpaper = response.data.result.properties.wallpaper;
    });

    // Get settings.json and put into constant

    $http.get('setup.json').then(function(response) {
      console.log(response.data);
      $rootScope.SETUP = response.data;
    });

    // Set socket.io
    alldevices().then(function(response) {
      $rootScope.devicelist = response.data.result;
    }).then(function() {
      angular.forEach(CONFIG.pages, function(pagesvalue) {
        angular.forEach(pagesvalue.widgets, function(widgetsvalue) {
          angular.forEach(widgetsvalue.capability, function(capabilityvalue) {
            socket.on(capabilityvalue, widgetsvalue.deviceid, function(data) {
              console.log(data);
              $rootScope.devicelist[widgetsvalue.deviceid].state[capabilityvalue] = data;
              $rootScope.$apply();
            });
          });
        });
      });
    });






  })
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
      if (to.name === 'setup.pages.page') {

        if (!$rootScope.CONFIG.pages.filter(function(e) {
            return e.pagename === params.pagename;
          }).length) {
          evt.preventDefault();
          console.log('Page not found!');
          $state.go('setup.pages');
        }
      }

      if (to.name === 'setup.pages.removepage') {

        if (!$rootScope.CONFIG.pages.filter(function(e) {
            return e.pagename === params.pagename;
          }).length) {
          evt.preventDefault();
          console.log('Page not found!');
          $state.go('setup.pages');
        }
      }

      if (to.name === 'setup.pages.addwidget') {

        if (!$rootScope.CONFIG.pages.filter(function(e) {
            return e.pagename === params.pagename;
          }).length) {
          evt.preventDefault();
          console.log('Page not found!');
          $state.go('setup.pages');
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


      if (to.name === 'setup.pages.addwidgettype') {
        to.templateUrl = 'views/setup-addwidget-' + params.type.toLowerCase() + '.html';
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
      .state('setup.pages.newpage', {
        url: '/new',
        templateUrl: 'views/setup-newpage.html',
        data: {
          'selectedTab': 1
        }
      })
      .state('setup.pages.removepage', {
        url: '/:pagename/remove/',
        templateUrl: 'views/setup-removepage.html',
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
      .state('setup.pages.removewidget', {
        url: '/:pagename/remove-widget/:widgetid/:widgetname',
        templateUrl: 'views/setup-removewidget.html',
        data: {
          'selectedTab': 1
        }
      })
      .state('setup.pages.addwidget', {
        url: '/:pagename/add-widget',
        templateUrl: 'views/setup-addwidget.html',
        data: {
          'selectedTab': 1
        }
      })
      .state('setup.pages.addwidgettype', {
        url: '/:pagename/add-widget/:type',
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
