'use strict';

/**
 * @ngdoc service
 * @name homeydashV3App.device
 * @description
 * # device
 * Factory in the homeydashV3App.
 */
angular.module('homeydashV3App')
  .factory('device', function(CONFIG, $http) {

    var obj = {};
    obj.onoff = function(currentId, cmd) {
      return $http.put('http://192.168.2.72/api/manager/devices/device/' + currentId + '/state', {
        'onoff': cmd
      });
    };
    obj.dim = function(currentId, dimValue) {
      return $http.put('http://192.168.2.72/api/manager/devices/device/' + currentId + '/state', {
        'dim': dimValue
      });
    };
    obj.button = function(currentId) {
      return $http.put('http://192.168.2.72/api/manager/devices/device/' + currentId + '/state', {
        'button': null
      });
    };
    return obj;

  });
