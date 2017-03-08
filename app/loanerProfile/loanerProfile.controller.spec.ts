'use strict';

describe('Component: LoanerProfileComponent', function () {

  // load the controller's module
  beforeEach(module('mortgageAppApp'));

  var LoanerProfileComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    LoanerProfileComponent = $componentController('loanerProfile', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
