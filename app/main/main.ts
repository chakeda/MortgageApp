'use strict';

angular.module('mortgageAppApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/?checkpoint',
        template: '<main></main>'
      });
  });
