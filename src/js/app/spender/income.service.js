angular.module('spender')
  .service('IncomeService', function Service(Restangular) {
    DataService.call(this, Restangular, 'incomes');
  });
