angular.module('spender')
  .service('CategoryService', function(Restangular) {
    var _categories = [],
      _categoriesPromise = false;

    this.loadAll = function(reload) {
      if (!_categoriesPromise || reload) {
        _categoriesPromise = Restangular.all('categories').getList().then(function(categories) {
          _categories = categories;
          return _categories;
        });
      }

      return _categoriesPromise;
    };

    this.getAll = function() {
      return _categories;
    };

    this.resetAll = function() {
      _categories = [];
      _categoriesPromise = false;
    };

    this.add = function (data) {
      return Restangular.all('categories').post(data);
    };

    this.update = function (data) {
      return Restangular.one('categories', data.id).patch(data);
    };

    this.delete = function (data) {
      return Restangular.one('categories', data.id).remove();
    };
  });
