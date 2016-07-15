angular.module('spender')
  .service('ExpenseService', function Service(Restangular, $injector) {
    DataService.call(this, Restangular, 'expenses');

    this.getUpdateData = function(entity) {
      var data = angular.copy(entity);
      if (data.targetIncome && data.targetIncome.sourceExpense) {
        delete data.targetIncome.sourceExpense;
      }
      return data;
    };

    this.afterLoad = function(expense) {
      expense.amount = +expense.amount;
      if (expense.targetIncomeId) {
        expense.targetIncomeId = +expense.targetIncomeId;
      }
      return expense;
    };

    this.afterAdd = function(expense) {
      var CacheService = $injector.get('CacheService');
      CacheService.prepareExpense(expense);
      return expense;
    };

    var superDelete = this.delete;
    this.delete = function(entity) {
      if (entity.targetIncome) {
        delete entity.targetIncome.sourceExpense;
      }

      return superDelete(entity);
    }
  });
