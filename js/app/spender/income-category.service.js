angular.module('spender')
  .service('IncomeCategoryService', function(Restangular) {
    var _categories = [];

    this.loadAll = function() {
      return Restangular.all('income-categories').getList().then(function(categories) {
        _categories = categories;
        return _categories;
      });
    };

    this.getAll = function() {
      return _categories;
    };

    this.add = function (data) {
      return Restangular.all('income-categories').post(data);
    };

    this.update = function (data) {
      return Restangular.one('income-categories', data.Id).patch(data);
    };

    this.delete = function (data) {
      return Restangular.one('income-categories', data.Id).remove();
    };
  });
