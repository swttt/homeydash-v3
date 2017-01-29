'use strict';

/**
 * @ngdoc service
 * @name homeydashV3App.wallpaper
 * @description
 * # wallpaper
 * Factory in the homeydashV3App.
 */
angular.module('homeydashV3App')
  .factory('wallpaper', function(CONFIG, $http) {
    var obj = {};
    obj = function() {
      return $http.get('http://192.168.2.72/api/manager/users/user/me');
    };

    return obj;
  });
