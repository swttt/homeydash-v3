'use strict';

/**
 * @ngdoc service
 * @name homeydashV3App.FeedLoader
 * @description
 * # FeedLoader
 * Factory in the homeydashV3App.
 */
angular.module('homeydashV3App')
  .factory('FeedLoader', function($http) {
    return {
      fetch: function(url) {


        // Actually fetch the feed
        return $http.jsonp('https://api.rss2json.com/v1/api.json?rss_url=' + url);


      }
    }
  });
