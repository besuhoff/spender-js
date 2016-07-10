angular.module('spender')
  .service('CurrencyService', function Service(Restangular) {
    DataService.call(this, Restangular, 'currencies');
  });
