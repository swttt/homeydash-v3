'use strict';

/**
 * @ngdoc directive
 * @name homeydashV3App.directive:rssfeed
 * @description
 * # rssfeed
 */
angular.module('homeydashV3App')
  .directive('rssfeed', function(FeedLoader) {
    return {
      templateUrl: function(elem, attrs) {
        return attrs.template
      },
      restrict: 'E',
      scope: false,
      link: function(scope, element, attrs) {
        //element.text('this is the rssfeed directive');
        console.log(attrs);
        FeedLoader.fetch(scope.widget.url).then(function(res) {
          console.log(res.data);
          scope.feed = res.data
        });
      }
    };
  });
