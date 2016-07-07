angular.module('spender')
  .service('ExpenseService', function(Restangular) {
    var _expenses = [],
      _expensesPromise = false;

    this.loadAll = function(reload) {
      if (!_expensesPromise || reload) {
        _expensesPromise = Restangular.all('expenses').getList().then(function(expenses) {
          _expenses = expenses;
          return _expenses;
        });
      }

      return _expensesPromise;
    };

    this.resetAll = function() {
      _expenses = [];
      _expensesPromise = false;
    };

    this.getAll = function() {
      return _expenses;
    };

    this.add = function (data) {
      return Restangular.all('expenses').post(data);
    };
  });
