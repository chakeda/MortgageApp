'use strict';

angular.module('mortgageAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('realtor', {
        url: '/realtor/:realtorAppName',
        template: '<realtor></realtor>'
      });
  });
