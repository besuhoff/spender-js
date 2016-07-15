angular.module('spender')
  .service('IncomeService', function Service(Restangular, $injector) {
    DataService.call(this, Restangular, 'incomes');

    this.getUpdateData = function(entity) {
      var data = angular.copy(entity);
      if (data.sourceExpense) {
        delete data.sourceExpense;
      }
      return data;
    };

    this.afterLoad = function(income) {
      income.amount = +income.amount;
      return income;
    };

    this.afterAdd = function(income) {
      var CacheService = $injector.get('CacheService');
      CacheService.prepareIncome(income);
      return income;
    };

    var superDelete = this.delete;
    this.delete = function(entity) {
      if (entity.sourceExpense) {
        delete entity.sourceExpense.targetIncome;
      }

      return superDelete(entity);
    }
  });
