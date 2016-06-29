angular.module('spender')
  .component('paymentMethodsPage', {
    templateUrl: 'js/app/spender/payment-methods-page/payment-methods-page.html',
    controller: function(DataService, PaymentMethodService) {
      var ctrl = this;

      function initMethod() {
        ctrl.paymentMethod = {};
      }

      function initMethods() {
        return PaymentMethodService.loadAll().then(function(paymentMethods) {
          ctrl.paymentMethods = paymentMethods;
        });
      }

      initMethods();
      initMethod();

      ctrl.saveMethod = function(paymentMethod) {
        if (paymentMethod.name && paymentMethod.currency) {
          return PaymentMethodService.update(paymentMethod).then(function() {
            return initMethods();
          });
        }
      };

      ctrl.addMethod = function() {
        if (ctrl.paymentMethod.name && ctrl.paymentMethod.currency) {
          return PaymentMethodService.add(ctrl.paymentMethod).then(function () {
            return initMethods().then(function () {
              initMethod();
            });
          })
        }
      };

      ctrl.deleteMethod = function(paymentMethod) {
        return PaymentMethodService.delete(paymentMethod).then(function() {
          return initMethods();
        })
      };
    }
  });
