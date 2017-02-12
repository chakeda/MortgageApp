'use strict';

describe('Component: LogoutComponent', function () {

  // load the controller's module
  beforeEach(module('mortgageAppApp'));

  var LogoutComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    LogoutComponent = $componentController('logout', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
