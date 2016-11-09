angular.module('spender')
  .component('historyPage', {
    bindings: {
      currentMonth: '<?'
    },
    templateUrl: 'js/app/spender/history-page/history-page.html',
    controller: function(ExpenseService, IncomeService, PaymentMethodService, WizardService,
                         $q, $state, $scope, $filter, $timeout, moment) {
      var ctrl = this,
        history = [],
        monthsMap = {};

      ctrl.months = [];

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
              .then(function() { return ExpenseService.delete(transaction.expense, true); })
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
        monthsMap = {};
        ctrl.months = [];

        history = history.concat(IncomeService.getAll()
          .filter(function(item) { return !item._isRemoved; })
          .map(function(income) {
            var createdAt = moment(income.createdAt);

            var entity = {
              id: income.id,
              createdAt: createdAt,
              income: income,
              type: 'income',
              category: income.incomeCategory,
              createdAtDate: createdAt.format('DD/MM, dddd'),
              createdAtMonthId: createdAt.format('YYYY-MM'),
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

              entity.amounts.unshift({
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
              createdAt: createdAt,
              expense: expense,
              type: 'expense',
              category: expense.category,
              createdAtDate: createdAt.format('DD/MM, dddd'),
              createdAtMonthId: createdAt.format('YYYY-MM'),
              createdAtFormattedCompact: createdAt.format('HH:mm'),
              comment: expense.comment,
              amounts: [{
                paymentMethod: expense.paymentMethod,
                value: expense.amount * -1
              }]
            };
          }));

        history.forEach(function(item) {
          if (!monthsMap[item.createdAtMonthId]) {
            monthsMap[item.createdAtMonthId] = item.createdAt.format('MMM');
          }
        });

        Object.keys(monthsMap).sort().reverse().forEach(function(monthId) {
          ctrl.months.push({ id: monthId, name: monthsMap[monthId] });
        });

        ctrl.currentMonth = ctrl.currentMonth || ctrl.months[0].id;

        ctrl.history = history
          .filter(function(item) {
            return item.createdAtMonthId === ctrl.currentMonth
          })
          .sort(function(a, b) {
            var diff = a.createdAt.diff(b.createdAt);
            return  diff < 0 ? 1 :
              diff > 0 ? -1 :
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

      ctrl.isHintVisible = function() {
        return WizardService.isHistoryHintVisible();
      };

      ctrl.close = function() {
        ctrl.loading = true;

        return WizardService.close().finally(function() {
          ctrl.loading = false;
        })
      };

      ctrl.gotoMonth = function(month) {
        if (month.id !== ctrl.currentMonth) {
          $state.go('history', { month: month.id });
        }
      };

      ctrl.isFirstMonth = function() {
        return ctrl.months[0].id === ctrl.currentMonth;
      };

      ctrl.isLastMonth = function() {
        return ctrl.months[ctrl.months.length - 1].id === ctrl.currentMonth;
      };

      ctrl.gotoPrevMonth = function() {
        if (!ctrl.isFirstMonth()) {
          ctrl.gotoMonth(ctrl.months[ctrl.months.map(function(month) { return month.id }).indexOf(ctrl.currentMonth) - 1]);
        }
      };

      ctrl.gotoNextMonth = function() {
        if (!ctrl.isLastMonth()) {
          ctrl.gotoMonth(ctrl.months[ctrl.months.map(function(month) { return month.id }).indexOf(ctrl.currentMonth) + 1]);
        }
      };
    }
  });
