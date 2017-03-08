'use strict';

angular.module('mortgageAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('loanerProfile', {
        url: '/loanerProfile',
        template: '<loaner-profile></loaner-profile>'
      });
  });
