angular.module('spender')
  .service('PaymentMethodService', function(Restangular) {
    var _paymentMethods = [],
      _paymentMethodsPromise = false;

    this.loadAll = function(reload) {
      if (!_paymentMethodsPromise || reload) {
        _paymentMethodsPromise = Restangular.all('payment-methods').getList().then(function(paymentMethods) {
          _paymentMethods = paymentMethods;
          return _paymentMethods;
        });
      }

      return _paymentMethodsPromise;
    };

    this.getAll = function() {
      return _paymentMethods;
    };

    this.resetAll = function() {
      _paymentMethods = [];
      _paymentMethodsPromise = false;
    };

    this.add = function (data) {
      return Restangular.all('payment-methods').post(data);
    };

    this.update = function (data) {
      return Restangular.one('payment-methods', data.id).patch(data);
    };

    this.delete = function (data) {
      return Restangular.one('payment-methods', data.id).remove();
    };
  });
