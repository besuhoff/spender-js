angular.module('spender')
  .service('PaymentMethodService', function(Restangular) {
    var _paymentMethods = [];

    this.loadAll = function() {
      return Restangular.all('payment-methods').getList().then(function(paymentMethods) {
        _paymentMethods = paymentMethods;
        return _paymentMethods;
      });
    };

    this.getAll = function() {
      return _paymentMethods;
    };

    this.add = function (data) {
      return Restangular.all('payment-methods').post(data);
    };

    this.update = function (data) {
      return Restangular.one('payment-methods', data.Id).patch(data);
    };

    this.delete = function (data) {
      return Restangular.one('payment-methods', data.Id).remove();
    };
  });
