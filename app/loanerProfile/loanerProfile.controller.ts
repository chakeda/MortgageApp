'use strict';

(function(){

class LoanerProfileController {
    
    $http;
    $localStorage;
    allResponses = [];
    updateSuccess = false;
    
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
        _id: '',
        loanOfficerName: ''
    };    
    realtors = [];
    
    constructor($http, $localStorage) {
        this.$http = $http;
        this.$localStorage = $localStorage;
        
        this.getData();
    }
    
    // same authentication protocal as admin
    getData() {
        
        // loan officers only!
        //     also note that realtors hold no significance in this realm
        this.$http.get('/me').then((response)=> { 
            this.userDataStorm = response.data;
            console.log(this.userDataStorm);
            this.loanOfficerName = this.userDataStorm.account.customData.loanOfficerName;
            if (!this.loanOfficerName) {
                // kite is default here
                //    however, it is impossible for a non loan officer to access this page due to the restrictions on stormpath
                //    because customData.loanOfficerName is set by myself in stormpath
                this.loanOfficerName = 'kitechristianson';
            }
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
    
    updateProfile() {
        this.$http.put('api/loanofficers/' + this.loanOfficer._id, this.loanOfficer).then((response)=> { 
            this.updateSuccess = true;
        }); 
    }
        
}

angular.module('mortgageAppApp')
  .component('loanerProfile', {
    templateUrl: 'app/loanerProfile/loanerProfile.html',
    controller: LoanerProfileController
  });

})();
