'use strict';

(function(){

class AdminComponent {
    constructor($http, $localStorage) {
        this.$http = $http;
        this.$localStorage = $localStorage;
        this.message = 'Hello';
        this.allResponses = '';
        this.realtorAppName = this.$localStorage.realtorAppName;
        this.getData();
    }
    
    getData() {
        
        // realtors only!
        this.$http.get('/me').then((response)=> { 
            this.userDataStorm = response.data;
            console.log(this.userDataStorm);
            this.realtorName = this.userDataStorm.account.customData.realtorAppName;
            if (!this.realtorAppName) {
                // Terry will always be default. 
                this.realtorAppName = 'terryfinnegan';
            }
            if (typeof this.realtorName === 'undefined') {
                this.isRealtor = false;
            } else { 
            
                // check if realtor from auth = realtor from app

                if (this.realtorName === this.realtorAppName) {
                    
                    // welcome, realtor!
                    this.isRealtor = true;
                    
                    //  realtor setter logic
                    this.$http.get('api/responses').then((response)=> { 
                        this.allResponses = response.data;
                        console.log(this.allResponses);
                        
                        // begin ranking algorithm
                        for (var i=0; i<this.allResponses.length; i++) {

                            var factor1 = 0;
                            if ((this.allResponses[i].totalIncome * 0.43) >= 2000) {
                                factor1 = 3;
                            } else if ((this.allResponses[i].totalIncome * 0.43) < 2000
                                && (this.allResponses[i].totalIncome * 0.43) > 1500) {
                                factor1 = 2;
                            } else if ((this.allResponses[i].totalIncome * 0.43) <= 1500) { 
                                factor1 = 1;
                            }
                            
                            var factor2 = 0;
                            if (this.allResponses[i].totalAssets >= 10000) {
                                factor2 = 3;
                            } else if ((this.allResponses[i].totalAssets < 10000)
                                && (this.allResponses[i].totalAssets > 7000)) {
                                factor2 = 2;
                            } else if (this.allResponses[i].totalAssets <= 7000) { 
                                factor2 = 1;
                            }
                            
                            var factor3 = 0;
                            if (this.allResponses[i].creditScore >= 720) {
                                factor3 = 3;
                            } else if ((this.allResponses[i].creditScore < 720)
                                && (this.allResponses[i].creditScore > 700)) {
                                factor3 = 2;
                            } else if (this.allResponses[i].creditScore <= 700) { 
                                factor3 = 1;
                            }
                            
                            var sumFactors = factor1 + factor2 + factor3;
                            
                            if (sumFactors === 9 || sumFactors === 8 || sumFactors === 7) {
                               this.allResponses[i].readyness = 1;
                            }
                            if (sumFactors === 6 || sumFactors === 5) {
                               this.allResponses[i].readyness = 2;
                            }
                            if (sumFactors < 5) {
                               this.allResponses[i].readyness = 3;
                            }
                            
                        }
                    });   
                    
                } else {
                    this.isRealtor = false;
                }
            
            }
        });
    }
  
    randomIntFromInterval(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    
    deleteUser(resp) {
        this.$http.delete('api/responses/' + resp._id).then((response)=> {
            this.getData();
        });    
    }
}

angular.module('mortgageAppApp')
  .component('admin', {
    templateUrl: 'app/admin/admin.html',
    controller: AdminComponent
  });

})();
