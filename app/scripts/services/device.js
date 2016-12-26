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
      return $http.put('http://' + CONFIG.homeyip + '/api/manager/devices/device/' + currentId + '/state', {
        'onoff': cmd
      }, CONFIG.httpconfig);
    };
    obj.dim = function(currentId, dimValue) {
      return $http.put('http://' + CONFIG.homeyip + '/api/manager/devices/device/' + currentId + '/state', {
        'dim': dimValue
      }, CONFIG.httpconfig);
    };
    return obj;

  });
