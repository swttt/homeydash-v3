'use strict';

describe('Service: wallpaper', function () {

  // load the service's module
  beforeEach(module('homeydashV3App'));

  // instantiate service
  var wallpaper;
  beforeEach(inject(function (_wallpaper_) {
    wallpaper = _wallpaper_;
  }));

  it('should do something', function () {
    expect(!!wallpaper).toBe(true);
  });

});
