'use strict';

(function(){

class LogoutComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('mortgageAppApp')
  .component('logout', {
    templateUrl: 'app/logout/logout.html',
    controller: LogoutComponent,
    controllerAs: 'logoutCtrl'
  });

})();
