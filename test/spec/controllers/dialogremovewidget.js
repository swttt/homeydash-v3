'use strict';

describe('Controller: DialogremovewidgetCtrl', function () {

  // load the controller's module
  beforeEach(module('homeydashV3App'));

  var DialogremovewidgetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DialogremovewidgetCtrl = $controller('DialogremovewidgetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DialogremovewidgetCtrl.awesomeThings.length).toBe(3);
  });
});
