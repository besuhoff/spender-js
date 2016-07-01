angular.module('spender')
  .component('expensesPage', {
    templateUrl: 'js/app/spender/expenses-page/expenses-page.html',
    controller: function(ExpenseService, ChartService, CategoryService, PaymentMethodService) {
      var ctrl = this;

      function initExpense() {
        ctrl.spent = {
          amount: 0
        };
      }

      function initExpenses(reload) {
        ExpenseService.loadAll(reload).then(function(expenses) {
          ctrl.expenses = expenses;
          ctrl.expensesChart = ChartService.buildTransactionsChart(expenses);
        });
      }

      function initPaymentMethods(reload) {
        PaymentMethodService.loadAll(reload).then(function(paymentMethods) {
          ctrl.paymentMethods = paymentMethods;
        });
      }

      ctrl.paymentMethods = [];
      ctrl.categories = [];
      ctrl.expenses = [];

      initExpenses();
      initPaymentMethods();

      CategoryService.loadAll().then(function(categories) {
        ctrl.categories = categories;
      });

      ctrl.save = function() {
        if (ctrl.spent.category && ctrl.spent.paymentMethod) {
          ctrl.spent.categoryId = ctrl.spent.category.id;
          ctrl.spent.paymentMethodId = ctrl.spent.paymentMethod.id;
          delete ctrl.spent.category;
          delete ctrl.spent.paymentMethod;

          ExpenseService.add(ctrl.spent).then(function() {
            initExpense();
            initExpenses(true);
            initPaymentMethods(true);
          });
        }
      }
    }
  });
