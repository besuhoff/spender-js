angular.module('spender')
  .component('transfersPage', {
    bindings: {
      expense: '=?',
      income: '=?'
    },
    templateUrl: 'js/app/spender/transfers-page/transfers-page.html',
    controller: function(IncomeService, ExpenseService, CategoryService, PaymentMethodService, $state, moment) {
      var ctrl = this;

      function initTransfer() {
        ctrl.expense = {
          createdAt: (ctrl.expense ? moment(ctrl.expense.createdAt).add(1, 'seconds') : moment()).format()
        };
        
        ctrl.income = {
          
        };

        ctrl.sourceIncomeCurrencyRate = 1;
        ctrl.targetIncomeCurrencyRate = 1;
      }

      ctrl.paymentMethods = PaymentMethodService.getAll().filter(function(item) { return !item._isRemoved; });
      if (!ctrl.expense && !ctrl.income) {
        initTransfer();
      } else {
        ctrl.sourceIncomeCurrencyRate = 1;
        ctrl.targetIncomeCurrencyRate = ctrl.income.amount / ctrl.expense.amount;

        if (ctrl.targetIncomeCurrencyRate < 1) {
          ctrl.sourceIncomeCurrencyRate /= ctrl.targetIncomeCurrencyRate;
          ctrl.targetIncomeCurrencyRate = 1;
        }

        ctrl.editMode = true;
      }

      ctrl.getTargetAmount = function() {
        if (ctrl.expense.paymentMethod && ctrl.income.paymentMethod) {
          if (ctrl.expense.paymentMethod.currency.id === ctrl.income.paymentMethod.currency.id) {
            return (ctrl.expense.amount || 0);
          } else if (ctrl.targetIncomeCurrencyRate && ctrl.sourceIncomeCurrencyRate) {
            return (ctrl.expense.amount || 0) * (ctrl.targetIncomeCurrencyRate / ctrl.sourceIncomeCurrencyRate);
          }
        }
        return undefined;
      };

      ctrl.save = function() {
        if (ctrl.getTargetAmount() !== undefined) {
          ctrl.income.amount = ctrl.getTargetAmount();
          ctrl.income.comment = ctrl.expense.comment;
          ctrl.income.createdAt = ctrl.expense.createdAt;

          IncomeService[!ctrl.editMode ? 'add' : 'update'](ctrl.income).then(function(income) {
            ctrl.expense.targetIncome = income;
            ExpenseService[!ctrl.editMode ? 'add' : 'update'](ctrl.expense).then(function() {
              if (ctrl.editMode) {
                $state.go('history');
              } else {
                initTransfer();
              }
            });

          });
        }
      }
    }
  });
