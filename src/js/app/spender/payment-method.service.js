angular.module('spender')
  .service('PaymentMethodService', function Service(Restangular, IncomeService, ExpenseService) {
    DataService.call(this, Restangular, 'payment-methods');

    var update = this.update;

    this.update = function(paymentMethod) {
      return update.call(this, paymentMethod).then(function(paymentMethod) {
        [IncomeService, ExpenseService].forEach(function(service) {
          var recordListChange = false;

          service.getAll().forEach(function(transaction) {
            if (transaction.paymentMethodId === paymentMethod.id && (
              transaction.paymentMethodName !== paymentMethod.name ||
              transaction.paymentMethodColor !== paymentMethod.color ||
              transaction.paymentMethodCurrency !== paymentMethod.currency
            )) {
              transaction.paymentMethodName = paymentMethod.name;
              transaction.paymentMethodColor = paymentMethod.color;
              transaction.paymentMethodCurrency = paymentMethod.currency;

              recordListChange = true;
            }

            if (transaction.sourceExpensePaymentMethodId === paymentMethod.id &&
              transaction.sourceExpensePaymentMethodCurrency !== paymentMethod.currency
            ) {
              transaction.sourceExpensePaymentMethodCurrency = paymentMethod.currency;

              recordListChange = true;
            }
          });

          if (recordListChange) {
            service.recordListChange();
          }
        });
      });
    }
  });
