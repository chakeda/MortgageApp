'use strict';

(function(){

class RealtorComponent {
    
    $http;
    $stateParams;
    $localStorage;
    $location;
    currentAbsUrl = '';
    
    constructor($http, $stateParams, $localStorage, $location) {
        this.$http = $http;
        this.$stateParams = $stateParams;
        this.$localStorage = $localStorage;
        this.$location = $location;
        
        // set realtorAppName and go to main!
        // grabbing the loan officer and all that will follow. 
        this.$localStorage.realtorAppName = this.$stateParams.realtorAppName;
        
        // we have two app urls now
        this.currentAbsUrl = this.$location.absUrl();
        if (this.currentAbsUrl.indexOf('app.uxweb.io') > -1) {
            window.location.href = 'http://app.uxweb.io';
        } else {
            window.location.href = 'http://homereadyevaluator.com';
        }
         
    }
}

angular.module('mortgageAppApp')
  .component('realtor', {
    templateUrl: 'app/realtor/realtor.html',
    controller: RealtorComponent,
    controllerAs: 'realtorCtrl'
  });

})();
