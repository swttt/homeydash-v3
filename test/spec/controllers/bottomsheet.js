'use strict';

describe('Controller: BottomsheetCtrl', function () {

  // load the controller's module
  beforeEach(module('homeydashV3App'));

  var BottomsheetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BottomsheetCtrl = $controller('BottomsheetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BottomsheetCtrl.awesomeThings.length).toBe(3);
  });
});
