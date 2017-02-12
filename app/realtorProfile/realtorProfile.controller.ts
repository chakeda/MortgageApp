'use strict';

(function(){

class RealtorProfileController {
    constructor($http, $localStorage) {
        this.$http = $http;
        this.$localStorage = $localStorage;
        
        this.updateSuccess = false;
        this.realtor = {};
        this.realtorAppName = this.$localStorage.realtorAppName;
        this.realtors = [];
        
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
                    this.$http.get('api/realtors').then((response)=> {
                        this.realtors = response.data;
                        console.log(this.realtors);
                        for (var i=0; i<this.realtors.length; i++) {
                            if (this.realtorAppName === this.realtors[i].realtorAppName) {
                                this.realtor = this.realtors[i];
                            }
                        }
                    });
                    
                } else {
                    this.isRealtor = false;
                }
            
            }
        });
    }
    
    updateProfile() {
        this.$http.put('api/realtors/' + this.realtor._id, this.realtor).then((response)=> { 
            this.updateSuccess = true;
        }); 
    }
        
        
}

angular.module('mortgageAppApp')
  .component('realtorProfile', {
    templateUrl: 'app/realtorProfile/realtorProfile.html',
    controller: RealtorProfileController
  });

})();
