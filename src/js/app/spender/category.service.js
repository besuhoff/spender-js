angular.module('spender')
  .service('CategoryService', function Service(Restangular, ExpenseService) {
    DataService.call(this, Restangular, 'categories');

    var update = this.update;

    this.update = function(category) {
      return update.call(this, category).then(function(category) {
        var recordListChange = false;

        ExpenseService.getAll().forEach(function(expense) {
          if (expense.categoryId === category.id && (
              expense.categoryName !== category.name ||
              expense.categoryColor !== category.color
          )) {
            expense.categoryName = category.name;
            expense.categoryColor = category.color;

            recordListChange = true;
          }
        });

        if (recordListChange) {
          ExpenseService.recordListChange();
        }
      });
    }
  });
