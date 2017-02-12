'use strict';

(function(){

class RealtorComponent {
    constructor($http, $stateParams, $localStorage, $location) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$localStorage = $localStorage;
        this.$location = $location;
        
        // set realtorAppName and go!
        this.$localStorage.realtorAppName = this.$stateParams.realtorAppName;
        window.location.href = 'http://app.uxweb.io'; 
    }
}

angular.module('mortgageAppApp')
  .component('realtor', {
    templateUrl: 'app/realtor/realtor.html',
    controller: RealtorComponent,
    controllerAs: 'realtorCtrl'
  });

})();
