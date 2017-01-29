'use strict';

describe('Controller: AgreementCtrl', function () {

  // load the controller's module
  beforeEach(module('homeydashV3App'));

  var AgreementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgreementCtrl = $controller('AgreementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AgreementCtrl.awesomeThings.length).toBe(3);
  });
});
