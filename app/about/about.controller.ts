'use strict';

(function(){

class AboutController {
    
  message = '';
  realtorAppName = '';
  realtors = [];
  realtor = {
      loanOfficerName: ''
  };
  loanOfficers = [];
  loanOfficer = {};
  $http;
  $localStorage;
  
  userDataStorm = {
    account: {
        customData: {
            loanOfficerName: '',
            userId: '',
            ADMIN: ''
        },
        href: ''
    }
  };

  userId;
  userData;
  payload;
  
  userRealtorAppName = '';
    
  constructor($http, $localStorage) {
    this.message = 'Hello';
    this.$http = $http;
    this.$localStorage = $localStorage;
    
    this.userRealtorAppName = '';
    
    // userId is in their stormpath - unlike the results page which can also auth from localstorage
    this.$http.get('/me').then((response)=> { 
        this.userDataStorm = response.data;
        console.log(this.userDataStorm);
        this.userId = this.userDataStorm.account.customData.userId;
        this.$http.get('api/responses/' + this.userId).then((response)=> {                 
            this.userData = response.data;
            this.userData.theMortgage = Math.round(this.userData.theMortgage/1000)*1000;
            console.log(this.userData);
            
            this.userRealtorAppName = this.userData.realtorAppName;
            
            this.authenticate();
        });
    })['catch']((response)=> { 
    
        // simply authenticate normally - realtorAppName will be kitechristianson
        this.authenticate();
    });
  }
  
  authenticate() {
    // realtor setter logic
    this.realtorAppName = this.$localStorage.realtorAppName;
    this.$http.get('api/realtors').then((response)=> {
        this.realtors = response.data;
        if (!this.realtorAppName) {
            // Kite will always be default - but if they have an application get it from there
            if (this.userRealtorAppName === '') {
                this.realtorAppName = 'kitechristianson';
            } else {
                this.realtorAppName = this.userRealtorAppName;
            }
        }
        for (var i=0; i<this.realtors.length; i++) {
            if (this.realtorAppName === this.realtors[i].realtorAppName) {
                this.realtor = this.realtors[i]; // BAM
            }
        }
        // Got the realtor?
        // Now we have to get the realtor's loan officer to fillout the data
        this.$http.get('api/loanOfficers').then((response)=> {
            this.loanOfficers = response.data;
        
            for (var i=0; i<this.loanOfficers.length; i++) {
                if (this.realtor.loanOfficerName === this.loanOfficers[i].loanOfficerName) {
                    this.loanOfficer = this.loanOfficers[i]; // we got our loan officer.
                    console.log(this.loanOfficer);
                }
            }
        });
    });    
  }
    
}

angular.module('mortgageAppApp')
  .component('about', {
    templateUrl: 'app/about/about.html',
    controller: AboutController
  });

})();
