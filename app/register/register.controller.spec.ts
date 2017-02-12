'use strict';

describe('Component: RegisterComponent', function () {

  // load the controller's module
  beforeEach(module('mortgageAppApp'));

  var RegisterComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    RegisterComponent = $componentController('register', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
