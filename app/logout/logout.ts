'use strict';

angular.module('mortgageAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logout', {
        url: '/logout',
        template: '<logout></logout>'
      });
  });
