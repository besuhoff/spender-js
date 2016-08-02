angular.module('spender')
  .component('historyPage', {
    templateUrl: 'js/app/spender/history-page/history-page.html',
    controller: function(ExpenseService, IncomeService, PaymentMethodService, $q, $state, $scope, $filter, $timeout, moment) {
      var ctrl = this,
        history = [];

      ctrl.removeTransaction = function(transaction) {
        if (!transaction.isMarkedForRemoval) {
          transaction.isMarkedForRemoval = true;

          $timeout(function() {
            transaction.isMarkedForRemoval = false;
          }, 5000);
        } else {
          var loaded = $q.when({});

          if (transaction.type === 'transfer') {
            loaded
              .then(function() { return ExpenseService.delete(transaction.expense); })
              .then(function() { return IncomeService.delete(transaction.income); });
          }

          if (transaction.type === 'expense') {
            loaded.then(function() { return ExpenseService.delete(transaction.expense); });
          }

          if (transaction.type === 'income') {
            loaded.then(function() { return IncomeService.delete(transaction.income); });
          }

          history.splice(history.indexOf(transaction), 1);
        }
      };

      function initHistory() {
        history = [];

        history = history.concat(IncomeService.getAll()
          .filter(function(item) { return !item._isRemoved; })
          .map(function(income) {
            var createdAt = moment(income.createdAt);

            var entity = {
              id: income.id,
              createdAt: income.createdAt,
              income: income,
              type: 'income',
              category: income.incomeCategory,
              createdAtDate: createdAt.format('DD/MM'),
              createdAtFormattedCompact: createdAt.format('HH:mm'),
              comment: income.comment,
              amounts: [{
                paymentMethod: income.paymentMethod,
                value: income.amount
              }]
            };

            if (income.sourceExpense) {
              entity.type = 'transfer';
              entity.expense = income.sourceExpense;

              entity.category = {
                name: 'Перевод денег'
              };

              entity.comment = '';

              entity.amounts.push({
                paymentMethod: entity.expense.paymentMethod,
                  value: entity.expense.amount * -1
                });
            }

            return entity;
          }));

        history = history.concat(ExpenseService.getAll()
          .filter(function(item) { return !item._isRemoved && !item.targetIncome; })
          .map(function(expense) {
            var createdAt = moment(expense.createdAt);

            return {
              id: expense.id,
              createdAt: expense.createdAt,
              expense: expense,
              type: 'expense',
              category: expense.category,
              createdAtDate: createdAt.format('DD/MM'),
              createdAtFormattedCompact: createdAt.format('HH:mm'),
              comment: expense.comment,
              amounts: [{
                paymentMethod: expense.paymentMethod,
                value: expense.amount * -1
              }]
            };
          }));

        ctrl.history = history.sort(function(a, b) {
          return a.createdAt < b.createdAt ? 1 :
            a.createdAt > b.createdAt ? -1 :
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
