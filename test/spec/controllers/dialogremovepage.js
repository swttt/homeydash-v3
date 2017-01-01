'use strict';

describe('Controller: DialogremovepageCtrl', function () {

  // load the controller's module
  beforeEach(module('homeydashV3App'));

  var DialogremovepageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogremovepageCtrl = $controller('DialogremovepageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DialogremovepageCtrl.awesomeThings.length).toBe(3);
  });
});
