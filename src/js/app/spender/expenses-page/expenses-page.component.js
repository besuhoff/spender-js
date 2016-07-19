angular.module('spender')
  .component('expensesPage', {
    bindings: {
      expense: '=?'
    },
    templateUrl: 'js/app/spender/expenses-page/expenses-page.html',
    controller: function($state, moment, ExpenseService, ChartService, CategoryService, PaymentMethodService) {
      var ctrl = this;

      function initExpense() {
        ctrl.expense = {
          createdAt: (ctrl.expense ? moment(ctrl.expense.createdAt).add(1, 'seconds') : moment()).format()
        };
      }

      function initExpenses() {
        ctrl.expenses = ExpenseService.getAll().filter(function(item) { return !item._isRemoved; });
        ctrl.expensesChart = ChartService.buildTransactionsChart(ctrl.expenses);
      }

      initExpenses();
      if (!ctrl.expense) {
        initExpense();
      } else {
        ctrl.expense.paymentMethod = PaymentMethodService.getOne(ctrl.expense.paymentMethodId);
        ctrl.expense.category = CategoryService.getOne(ctrl.expense.categoryId);
        ctrl.editMode = true;
      }

      ctrl.paymentMethods = PaymentMethodService.getAll().filter(function(item) { return !item._isRemoved; });
      ctrl.categories = CategoryService.getAll().filter(function(item) { return !item._isRemoved; });

      ctrl.save = function() {
        if (ctrl.expense.category && ctrl.expense.paymentMethod) {
          ExpenseService[!ctrl.editMode ? 'add' : 'update'](ctrl.expense).then(function() {
            if (ctrl.editMode) {
              $state.go('history');
            } else {
              initExpense();
              initExpenses();
            }
          });
        }
      };

      ctrl.hasChart = function() {
        return ctrl.expensesChart && Object.keys(ctrl.expensesChart).length > 0;
      };
    }
  });
