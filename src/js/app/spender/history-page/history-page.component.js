angular.module('spender')
  .component('historyPage', {
    templateUrl: 'js/app/spender/history-page/history-page.html',
    controller: function(ExpenseService, IncomeService, PaymentMethodService, $q, $state, $scope, $filter, moment) {
      var ctrl = this,
        history = [];

      ctrl.getEditLink = function(transaction) {
        var type = transaction._isNextRecordBound ? 'transfer' : transaction.entityType;
        return $state.href(type + '-edit', { id: transaction.id });
      };

      ctrl.removeTransaction = function(transaction) {
        var loaded = $q.when({});

        if (transaction.entityType === 'income') {
          if (transaction.sourceExpense) {
            history.splice(history.indexOf(transaction.sourceExpense), 1);
            loaded = loaded.then(function() { return ExpenseService.delete(transaction.sourceExpense); });
          }
          history.splice(history.indexOf(transaction), 1);
          loaded = loaded.then(function() { return IncomeService.delete(transaction); });
        }

        if (transaction.entityType === 'expense') {
          history.splice(history.indexOf(transaction), 1);
          loaded = loaded.then(function() { return ExpenseService.delete(transaction); });
          if (transaction.targetIncome) {
            history.splice(history.indexOf(transaction.targetIncome), 1);
            loaded = loaded.then(function() { return IncomeService.delete(transaction.targetIncome); });
          }
        }
      };

      function initHistory() {
        history = [];

        history = history.concat(IncomeService.getAll()
          .filter(function(item) { return !item._isRemoved; })
          .map(function(income) {
            income = angular.copy(income);
            income.entityType = 'income';
            income.category = income.incomeCategory;

            income.createdAtFormatted = moment(income.createdAt).format('DD/MM/YYYY HH:mm');
            income.createdAtFormattedCompact = moment(income.createdAt).format('DD/MM HH:mm');

            if (income.sourceExpense) {
              income._isNextRecordBound = true;
              income.category = { name: 'Перевод' };
              income.comment = $filter('currency')(income.sourceExpense.amount, income.sourceExpense.paymentMethod.currency.symbol, 2) + ' со счета ' + income.sourceExpense.paymentMethod.name;
            }

            return income;
          }));

        history = history.concat(ExpenseService.getAll()
          .filter(function(item) { return !item._isRemoved; })
          .map(function(expense) {
            expense = angular.copy(expense);
            expense.entityType = 'expense';
            expense.createdAtFormatted = moment(expense.createdAt).format('DD/MM/YYYY HH:mm');
            expense.createdAtFormattedCompact = moment(expense.createdAt).format('DD/MM HH:mm');
            expense.amount *= -1;

            if (expense.targetIncome) {
              expense._isPrevRecordBound = true;
              expense.category = { name: 'Перевод' };
              expense.comment = $filter('currency')(expense.targetIncome.amount, expense.targetIncome.paymentMethod.currency.symbol, 2) + ' на счет ' + expense.targetIncome.paymentMethod.name;
            }

            return expense;
          }));

        ctrl.history = history.sort(function(a, b) {
          return a.createdAt < b.createdAt ? 1 :
            a.createdAt > b.createdAt ? -1 :
              (b.sourceExpense && b.sourceExpense.id === a.id) ? 1 :
                (a.sourceExpense && a.sourceExpense.id === b.id) ? -1 :
                  0;
        });
      }

      initHistory();

      $scope.$watch(
        function() {
          return PaymentMethodService.getListChangedAt();
        },
        function(newDate, oldDate) {
          if (newDate !== oldDate) {
            initHistory();
          }
        }
      );

      $scope.$watch(
        function() {
          return IncomeService.getListChangedAt();
        },
        function(newDate, oldDate) {
          if (newDate !== oldDate) {
            initHistory();
          }
        }
      );

      $scope.$watch(
        function() {
          return ExpenseService.getListChangedAt();
        },
        function(newDate, oldDate) {
          if (newDate !== oldDate) {
            initHistory();
          }
        }
      );
    }
  });
