angular.module('spender')
  .component('transfersPage', {
    templateUrl: 'js/app/spender/transfers-page/transfers-page.html',
    controller: function(IncomeService, ExpenseService, CategoryService, PaymentMethodService) {
      var ctrl = this;

      function initExpense() {
        ctrl.spent = {
          createdAt: ctrl.spent ? ctrl.spent.createdAt : moment().format()
        };
        
        ctrl.income = {
          
        };

        ctrl.sourceIncomeCurrencyRate = 1;
        ctrl.targetIncomeCurrencyRate = 1;
      }

      initPaymentMethods();
      initExpense();

      ctrl.getTargetAmount = function() {
        if (ctrl.spent.paymentMethod && ctrl.income.paymentMethod) {
          if (ctrl.spent.paymentMethod.currency === ctrl.income.paymentMethod.currency) {
            return (ctrl.spent.amount || 0);
          } else if (ctrl.targetIncomeCurrencyRate && ctrl.sourceIncomeCurrencyRate) {
            return (ctrl.spent.amount || 0) * (ctrl.targetIncomeCurrencyRate / ctrl.sourceIncomeCurrencyRate);
          }
        }
        return undefined;
      };

      function initPaymentMethods(reload) {
        PaymentMethodService.loadAll(reload).then(function(paymentMethods) {
          ctrl.paymentMethods = paymentMethods;
        });
      }

      ctrl.paymentMethods = [];

      ctrl.save = function() {
        if (ctrl.getTargetAmount() !== undefined) {
          ctrl.income.amount = ctrl.getTargetAmount();
          ctrl.income.comment = ctrl.spent.comment;
          ctrl.income.createdAt = ctrl.spent.createdAt;

          ctrl.spent.paymentMethodId = ctrl.spent.paymentMethod.id;
          ctrl.income.paymentMethodId = ctrl.income.paymentMethod.id;
          delete ctrl.spent.paymentMethod;
          delete ctrl.income.paymentMethod;

          IncomeService.add(ctrl.income).then(function(income) {
            ctrl.spent.targetIncomeId = income.id;
            ExpenseService.add(ctrl.spent).then(function() {
              initExpense();
              initPaymentMethods(true);
            });

          });
        }
      }
    }
  });
