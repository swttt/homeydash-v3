'use strict';

describe('Service: FeedLoader', function () {

  // load the service's module
  beforeEach(module('homeydashV3App'));

  // instantiate service
  var FeedLoader;
  beforeEach(inject(function (_FeedLoader_) {
    FeedLoader = _FeedLoader_;
  }));

  it('should do something', function () {
    expect(!!FeedLoader).toBe(true);
  });

});
