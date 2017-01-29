'use strict';

/**
 * @ngdoc service
 * @name homeydashV3App.socket
 * @description
 * # socket
 * Factory in the homeydashV3App.
 */
angular.module('homeydashV3App')
  .factory('socket', function(CONFIG) {


    return {
      on: function(eventName, deviceid, callback) {
        var socket = io.connect('http://192.168.2.72/realtime/device/' + deviceid + '/', {
          transports: ['websocket', 'polling'],
        });
        socket.on(eventName, callback);
      }
    };
  });
