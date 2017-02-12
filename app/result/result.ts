'use strict';

angular.module('mortgageAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('result', {
        url: '/result?user',
        template: '<result></result>'
      });
  });
