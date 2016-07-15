angular.module('spender')
  .service('CategoryService', function Service(Restangular) {
    DataService.call(this, Restangular, 'categories');
  });
