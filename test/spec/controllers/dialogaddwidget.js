'use strict';

describe('Controller: DialogaddwidgetCtrl', function () {

  // load the controller's module
  beforeEach(module('homeydashV3App'));

  var DialogaddwidgetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogaddwidgetCtrl = $controller('DialogaddwidgetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DialogaddwidgetCtrl.awesomeThings.length).toBe(3);
  });
});
