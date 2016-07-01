angular.module('spender')
  .service('IncomeCategoryService', function(Restangular) {
    var _categories = [],
    _categoriesPromise = false;

    this.loadAll = function(reload) {
      if (!_categoriesPromise || reload) {
        _categoriesPromise = Restangular.all('income-categories').getList().then(function(categories) {
          _categories = categories;
          return _categories;
        });
      }

      return _categoriesPromise;
    };

    this.getAll = function() {
      return _categories;
    };

    this.add = function (data) {
      return Restangular.all('income-categories').post(data);
    };

    this.update = function (data) {
      return Restangular.one('income-categories', data.id).patch(data);
    };

    this.delete = function (data) {
      return Restangular.one('income-categories', data.id).remove();
    };
  });
