angular.module('spender')
  .service('IncomeService', function(Restangular) {
    var _incomes = [],
      _incomesPromise = false;

    this.loadAll = function(reload) {
      if (!_incomesPromise || reload) {
        _incomesPromise = Restangular.all('incomes').getList().then(function(incomes) {
          _incomes = incomes;
          return _incomes;
        });
      }

      return _incomesPromise;
    };

    this.getAll = function() {
      return _incomes;
    };

    this.add = function (data) {
      return Restangular.all('incomes').post(data);
    };
  });
