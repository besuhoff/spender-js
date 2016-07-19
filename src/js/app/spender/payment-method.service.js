angular.module('spender')
  .service('PaymentMethodService', function Service(Restangular, $injector) {
    DataService.call(this, Restangular, 'payment-methods');

    this.afterLoad = function(paymentMethod) {
      paymentMethod.initialAmount = +paymentMethod.initialAmount;
      paymentMethod.expenses = +paymentMethod.expenses;
      paymentMethod.incomes = +paymentMethod.incomes;
      paymentMethod._isRemoved = !!+paymentMethod._isRemoved;
      return paymentMethod;
    };

    this.afterAdd = function(paymentMethod) {
      $injector.get('CacheService').preparePaymentMethod(paymentMethod);
      return paymentMethod;
    };
  });
