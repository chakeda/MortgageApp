'use strict';

(function(){

class RegisterComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('mortgageAppApp')
  .component('register', {
    templateUrl: 'app/register/register.html',
    controller: RegisterComponent,
    controllerAs: 'registerCtrl'
  });

})();
