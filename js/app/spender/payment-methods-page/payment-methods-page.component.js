angular.module('spender')
  .component('paymentMethodsPage', {
    templateUrl: 'js/app/spender/payment-methods-page/payment-methods-page.html',
    controller: function(DataService) {
      var ctrl = this;

      function initMethod() {
        ctrl.paymentMethod = {};
      }

      function initMethods() {
        return DataService.loadPaymentMethods().then(function(paymentMethods) {
          ctrl.paymentMethods = paymentMethods;
        });
      }

      initMethods();
      initMethod();

      ctrl.saveMethod = function(paymentMethod) {
        if (paymentMethod.Name && paymentMethod.Currency) {
          return DataService.updatePaymentMethod(paymentMethod).then(function() {
            return initMethods();
          });
        }
      };

      ctrl.addMethod = function() {
        if (ctrl.paymentMethod.Name && ctrl.paymentMethod.Currency) {
          return DataService.addPaymentMethod(ctrl.paymentMethod).then(function () {
            return initMethods().then(function () {
              initMethod();
            });
          })
        }
      };

      ctrl.deleteMethod = function(paymentMethod) {
        return DataService.deletePaymentMethod(paymentMethod).then(function() {
          return initMethods();
        })
      };
    }
  });
