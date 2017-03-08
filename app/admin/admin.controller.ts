'use strict';

(function(){

class AdminComponent {
    
    $http;
    $localStorage;
    allResponses = [];
    reverseSort = false;
    orderByField = 'readyness';
    filterAll = '';
    
    userDataStorm = {
        account: {
            customData: {
                loanOfficerName: ''   
            }
        }
    };
    loanOfficerName = '';
    isLoanOfficer = false;
    loanOfficers = [];
    loanOfficer = {
        loanOfficerName: ''
    };
    
    realtors = [];
    
    constructor($http, $localStorage) {
        this.$http = $http;
        this.$localStorage = $localStorage;
        this.allResponses = [];
        this.reverseSort = false;
        this.orderByField = 'readyness';
        this.filterAll = '';
        
        this.getData();
    }
    
    getData() {
        
        // loan officers only!
        //     also note that realtors hold no significance in this realm
        this.$http.get('/me').then((response)=> { 
            this.userDataStorm = response.data;
            console.log(this.userDataStorm);
            this.loanOfficerName = this.userDataStorm.account.customData.loanOfficerName;
            /*
            Disregard this block - this allows non users to enter
            if (!this.loanOfficerName) {
                // kite is default here
                //    however, it is impossible for a non loan officer to access this page due to the restrictions on stormpath
                //    because customData.loanOfficerName is set by myself in stormpath
                this.loanOfficerName = 'kitechristianson';
            }
            */
            if (typeof this.loanOfficerName === 'undefined') {
                this.isLoanOfficer = false;
            } else { 
            
                // get loan officer
                this.$http.get('api/loanOfficers').then((response)=> {
                    this.loanOfficers = response.data;
                
                    for (var i=0; i<this.loanOfficers.length; i++) {
                        if (this.loanOfficerName === this.loanOfficers[i].loanOfficerName) {
                            this.loanOfficer = this.loanOfficers[i];
                            
                            // check if realtor from auth = realtor from app
                            if (this.loanOfficerName === this.loanOfficer.loanOfficerName) {
                                
                                // welcome, realtor!
                                this.isLoanOfficer = true;
                                this.$http.get('api/responses').then((response)=> { 
                                    this.allResponses = response.data;
                                    console.log(this.allResponses);
                                    
                                    this.rankingAlgorithm();
                                    
                                    this.filterResults();
                                });
                                
                            } else {
                                this.isLoanOfficer = false;
                            }
                        }
                    }
                });
                
            }
        });
    }
    
    // only get responses where realtor is connected to loanofficer
    filterResults() {
        this.$http.get('api/realtors').then((response)=> {
            this.realtors = response.data;
            
            // decorate the responses with realtor's loanofficer
            for (var i=0; i<this.allResponses.length; i++) {
                for (var j=0; j<this.realtors.length; j++) {
                    if (this.allResponses[i].realtorAppName === this.realtors[j].realtorAppName) {
                        this.allResponses[i].loanOfficerName = this.realtors[j].loanOfficerName;
                    }
                }
            }
            
            // now we can filter in the UI
        });
    }
    
    // begin ranking algorithm as per terry
    rankingAlgorithm() {
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
