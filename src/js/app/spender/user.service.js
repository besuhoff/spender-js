angular.module('spender')
  .service('UserService', function Service(Restangular) {
    this.create = function() {
      return Restangular.all('users').post({});
    }
  });
