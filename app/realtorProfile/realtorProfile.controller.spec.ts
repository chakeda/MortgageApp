'use strict';

describe('Component: RealtorProfileComponent', function () {

  // load the controller's module
  beforeEach(module('mortgageAppApp'));

  var RealtorProfileComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    RealtorProfileComponent = $componentController('realtorProfile', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
