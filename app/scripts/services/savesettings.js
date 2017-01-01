'use strict';

/**
 * @ngdoc service
 * @name homeydashV3App.savesettings
 * @description
 * # savesettings
 * Factory in the homeydashV3App.
 */
angular.module('homeydashV3App')
  .factory('savesettings', function(CONFIG, $http) {
    var obj = {};
    obj.save = function(config) {
      return $http.post('//' + CONFIG.homeyip + '/api/app/com.swttt.homeydash/savesettings', config, CONFIG.httpconfig);
    };
    return obj;
  });
