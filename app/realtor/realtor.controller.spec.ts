'use strict';

describe('Component: RealtorComponent', function () {

  // load the controller's module
  beforeEach(module('mortgageAppApp'));

  var RealtorComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    RealtorComponent = $componentController('realtor', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
