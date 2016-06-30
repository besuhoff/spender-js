angular.module('spender')
  .service('IncomeService', function(Restangular) {
    var _incomes = [];

    this.loadAll = function() {
      return Restangular.all('incomes').getList().then(function(incomes) {
        _incomes = incomes;
        return _incomes;
      });
    };

    this.getAll = function() {
      return _incomes;
    };

    this.add = function (data) {
      return Restangular.all('incomes').post(data);
    };
  });
