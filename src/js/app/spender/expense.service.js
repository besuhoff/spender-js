angular.module('spender')
  .service('ExpenseService', function Service(Restangular) {
    DataService.call(this, Restangular, 'expenses');
  });
