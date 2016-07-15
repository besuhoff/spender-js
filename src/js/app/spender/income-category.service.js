angular.module('spender')
  .service('IncomeCategoryService', function Service(Restangular) {
    DataService.call(this, Restangular, 'income-categories');
  });
