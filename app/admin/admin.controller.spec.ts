'use strict';

describe('Component: AdminComponent', function () {

  // load the controller's module
  beforeEach(module('mortgageAppApp'));

  var AdminComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    AdminComponent = $componentController('admin', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
