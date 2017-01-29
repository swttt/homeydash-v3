'use strict';

/**
 * @ngdoc service
 * @name homeydashV3App.alldevices
 * @description
 * # alldevices
 * Factory in the homeydashV3App.
 */
angular.module('homeydashV3App')
  .factory('alldevices', function(CONFIG, $http) {

    var obj = {};
    obj = function() {
      return $http.get('http://192.168.2.72/api/manager/devices/device/');
    };

    return obj;

  });
