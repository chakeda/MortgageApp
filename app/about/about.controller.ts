'use strict';

(function(){

class AboutController {
  constructor($http, $localStorage) {
    this.message = 'Hello';
    this.$http = $http;
    this.$localStorage = $localStorage;
    
    // realtor setter logic
    this.realtorAppName = this.$localStorage.realtorAppName;
    this.$http.get('api/realtors').then((response)=> {
        this.realtors = response.data;
        if (!this.realtorAppName) {
            // Terry will always be default. 
            this.realtorAppName = 'terryfinnegan';
        }
        for (var i=0; i<this.realtors.length; i++) {
            if (this.realtorAppName === this.realtors[i].realtorAppName) {
                this.realtor = this.realtors[i]; 
                console.log(this.realtor);
            }
        }
    }); 
  }
  
}

angular.module('mortgageAppApp')
  .component('about', {
    templateUrl: 'app/about/about.html',
    controller: AboutController
  });

})();
