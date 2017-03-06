'use strict';

describe('Directive: mjpeg', function () {

  // load the directive's module
  beforeEach(module('homeydashV3App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mjpeg></mjpeg>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mjpeg directive');
  }));
});
