'use strict';

describe('Service: savesettings', function () {

  // load the service's module
  beforeEach(module('homeydashV3App'));

  // instantiate service
  var savesettings;
  beforeEach(inject(function (_savesettings_) {
    savesettings = _savesettings_;
  }));

  it('should do something', function () {
    expect(!!savesettings).toBe(true);
  });

});
