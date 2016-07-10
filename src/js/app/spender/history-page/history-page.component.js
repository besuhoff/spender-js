angular.module('spender')
  .component('historyPage', {
    templateUrl: 'js/app/spender/history-page/history-page.html',
    controller: function(ExpenseService, IncomeService, $q, moment, $filter) {
      var ctrl = this,
        incomesMap = {},
        isDataLoaded = [];

      ctrl.history = [];

      isDataLoaded.push(IncomeService.loadAll().then(function(incomes) {
        ctrl.history = ctrl.history.concat(incomes.map(function(income) {
          income = angular.copy(income);

          income.createdAtFormatted = moment(income.createdAt).format('DD/MM/YYYY HH:mm');
          income.createdAtFormattedCompact = moment(income.createdAt).format('DD/MM HH:mm');

          incomesMap[income.id] = income;

          if (income.sourceExpenseId) {
            income.categoryName = 'перевод';
            income.comment = $filter('currency')(income.sourceExpenseAmount, '', 2) + ' ' + income.sourceExpensePaymentMethodCurrency + ' со счета ' + income.sourceExpensePaymentMethodName;
          }

          return income;
        }));
      }));

      isDataLoaded.push(ExpenseService.loadAll().then(function(expenses) {
        ctrl.history = ctrl.history.concat(expenses.map(function(expense) {
          expense = angular.copy(expense);
          expense.createdAtFormatted = moment(expense.createdAt).format('DD/MM/YYYY HH:mm');
          expense.createdAtFormattedCompact = moment(expense.createdAt).format('DD/MM HH:mm');
          expense.amount *= -1;

          if (expense.targetIncomeId) {
            var income = incomesMap[expense.targetIncomeId];
            expense.categoryName = 'перевод';
            expense.comment = $filter('currency')(income.amount, '', 2) + ' ' + income.paymentMethodCurrency + ' на счет ' + income.paymentMethodName;
          }

          return expense;
        }));
      }));

      $q.all(isDataLoaded).then(function() {
        ctrl.history = ctrl.history.sort(function(a, b) {
          return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
        })
      })
    }
  });
