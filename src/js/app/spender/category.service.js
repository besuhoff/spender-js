angular.module('spender')
  .service('CategoryService', function(Restangular) {
    var _categories = [];

    this.loadAll = function() {
      return Restangular.all('categories').getList().then(function(categories) {
        _categories = categories;
        return _categories;
      });
    };

    this.getAll = function() {
      return _categories;
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
