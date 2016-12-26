'use strict';

describe('Service: alldevices', function () {

  // load the service's module
  beforeEach(module('homeydashV3App'));

  // instantiate service
  var alldevices;
  beforeEach(inject(function (_alldevices_) {
    alldevices = _alldevices_;
  }));

  it('should do something', function () {
    expect(!!alldevices).toBe(true);
  });

});
