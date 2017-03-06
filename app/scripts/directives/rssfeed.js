'use strict';

/**
 * @ngdoc directive
 * @name homeydashV3App.directive:rssfeed
 * @description
 * # rssfeed
 */
angular.module('homeydashV3App')
  .directive('rssfeed', function(FeedLoader, $timeout) {
    return {
      templateUrl: function(elem, attrs) {
        return attrs.template
      },
      restrict: 'E',
      scope: false,
      link: function(scope, element, attrs) {
        scope.$ready = true;

        (function tick() {
          if (scope.$ready === true) {
            FeedLoader.fetch(scope.widget.url).then(function(res) {
              console.log(res.data);
              scope.feed = null;
              console.log('update rss');
              scope.feed = res.data;
            })

          }

          $timeout(tick, 300000);
        }());

        ;
      }
    };
  });
