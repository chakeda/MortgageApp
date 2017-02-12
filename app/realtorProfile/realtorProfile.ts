'use strict';

angular.module('mortgageAppApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('realtorProfile', {
        url: '/realtorProfile',
        template: '<realtor-profile></realtor-profile>'
      });
  });
