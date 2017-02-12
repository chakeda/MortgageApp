'use strict';

angular.module('mortgageAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        template: '<admin></admin>'
      });
  });
