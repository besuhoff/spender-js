angular.module('spender')
  .service('IncomeCategoryService', function Service(Restangular, IncomeService) {
    DataService.call(this, Restangular, 'income-categories');

    var update = this.update;

    this.update = function(category) {
      return update.call(this, category).then(function(category) {
        var recordListChange = false;

        IncomeService.getAll().forEach(function(income) {
          if (income.incomeCategoryId === category.id && (
              income.incomeCategoryName !== category.name ||
              income.incomeCategoryColor !== category.color
          )) {
            income.incomeCategoryName = category.name;
            income.incomeCategoryColor = category.color;

            recordListChange = true;
          }
        });

        if (recordListChange) {
          IncomeService.recordListChange();
        }
      });
    }
  });
