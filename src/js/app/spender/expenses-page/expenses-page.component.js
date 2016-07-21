angular.module('spender')
  .component('expensesPage', {
    bindings: {
      expense: '=?'
    },
    templateUrl: 'js/app/spender/expenses-page/expenses-page.html',
    controller: function($state, moment, ExpenseService, ChartService, CategoryService, PaymentMethodService, $scope) {
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
        ctrl.editMode = true;
      }

      $scope.$watch(
        function() {
          return ExpenseService.getListChangedAt();
        },
        function(newDate, oldDate) {
          if (newDate !== oldDate) {
            initExpenses();
          }
        }
      );

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

      ctrl.getRequirements = function() {
        var requirements = [],
          validatedObject = ctrl.expense;

        if (!validatedObject.amount) {
          requirements.push('сумму');
        }
        if (!validatedObject.category) {
          requirements.push('категорию');
        }
        if (!validatedObject.paymentMethod) {
          requirements.push('счёт');
        }

        if (!requirements.length) {
          return false;
        }

        var last = requirements.pop();

        return requirements.join(', ') + (requirements.length ? ' и ' : '') + last;
      };

      ctrl.canSave = function() {
        return !ctrl.getRequirements();
      }
    }
  });
