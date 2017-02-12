'use strict';

angular.module('mortgageAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('register', {
        url: '/register?user',
        template: '<register></register>'
      });
  });
