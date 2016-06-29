angular.module('spender')
  .service('ExpenseService', function(Restangular) {
    var _expenses = [];

    this.loadAll = function() {
      return Restangular.all('expenses').getList().then(function(expenses) {
        _expenses = expenses;
        return _expenses;
      });
    };

    this.getAll = function() {
      return _expenses;
    };

    this.add = function (data) {
      return Restangular.all('expenses').post(data);
    };
  });
