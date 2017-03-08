'use strict';

(function(){

class ResultComponent {
    
message;
$http;
$localStorage;
prospectiveHomeValue;
zipCode;
annualTax;
estInsurance;
down;
hoa;  

userId;
isAdmin;
isLoanOfficer;
realtorAppName = '';
realtors = [];
realtor = {
    loanOfficerName: ''
};
loanOfficers = [];
loanOfficer = {
    mobilePhone: '',
    name: '',
    email: ''
};

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

userData;
payload;

userRealtorAppName = '';

  
  constructor($http, $localStorage) {
    this.message = 'Hello';
    this.$http = $http;
    this.$localStorage = $localStorage;
    this.prospectiveHomeValue = 0;
    this.zipCode = 0;
    this.annualTax = 0;
    this.estInsurance = 0;
    this.down = 0;
    this.hoa = 0;
    
    this.userRealtorAppName = '';
    
    // this would be set from the register link at the end of main
    this.userId = this.$localStorage.userId;
    if (this.userId) {
        this.$http.get('api/responses/' + this.userId).then((response)=> { 
            this.userData = response.data;
            this.userData.theMortgage = Math.round(this.userData.theMortgage/1000)*1000;
            this.userRealtorAppName = this.userData.realtorAppName;
            console.log(this.userData);
            
            // we set their userId in stormpath for the first time
            this.$http.get('/me').then((response)=> { 
                this.userDataStorm = response.data;
                console.log(this.userDataStorm);
                
                this.payload = {};
                this.payload.userId = this.userId;
                this.payload.href = this.userDataStorm.account.href;
                
                this.$http.post('api/profile', this.payload).then((response)=> { 
                    
                    this.authenticate();
                });
            });
        });
        
    } else {
        // userId is in their stormpath
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
        });
        
        // we don't catch the else block as in about.controller because authentication is required
        
    }
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
  
  // POST to stormpath logout route
  logout() {
    var post = {};
    this.$http.post('logout', post).then((response)=> {
        window.location.href = 'http://app.uxweb.io/logout';
    });  
  }
  
  // recalculate mortgage loan
  updateHomeValue() {
      var insurance = 171;
      var mortgageInsurance = 75;
      if ((this.prospectiveHomeValue > 250000) && (this.prospectiveHomeValue <= 350000)) {
        var propertyTax = 250;
      } else if ((this.prospectiveHomeValue > 350000)) {
        var propertyTax = 300;
      } else {
        // no change, default is this
        var propertyTax = 167;
      }
      var PandI = this.userData.maxHousingExpense 
        - (insurance + propertyTax + mortgageInsurance);
      
      this.userData.principleAndInterestPayment = PandI;
      this.userData.theMortgage = (PandI / 5.07) * 1000; // 4.77 -> 5.07 as of 11/19
      
      console.log(this.userData.principleAndInterestPayment);
      console.log(this.userData.theMortgage);
  }
  
  // stub
  updateUserData() {
      this.userData.prospectiveHomeValue = this.prospectiveHomeValue;
  }
  
}

angular.module('mortgageAppApp')
  .component('result', {
    templateUrl: 'app/result/result.html',
    controller: ResultComponent
  });

})();
