angular.module('spender')
  .component('paymentMethodsPage', {
    templateUrl: 'js/app/spender/payment-methods-page/payment-methods-page.html',
    controller: function(PaymentMethodService) {
      var ctrl = this;

      function initMethod() {
        ctrl.paymentMethod = {};
        ctrl.isNewLoaded = undefined;
      }

      function initMethods(reload) {
        return PaymentMethodService.loadAll(reload).then(function(paymentMethods) {
          ctrl.paymentMethods = paymentMethods;
          ctrl.isLoaded = {};
          ctrl.updateSelectedColors();
        });
      }

      initMethods();
      initMethod();

      ctrl.saveMethod = function(paymentMethod) {
        if (paymentMethod.name && paymentMethod.currency) {
          ctrl.isLoaded[paymentMethod.id] = PaymentMethodService.update(paymentMethod);

          return ctrl.isLoaded[paymentMethod.id];
        }
      };

      ctrl.addMethod = function() {
        if (ctrl.paymentMethod.name && ctrl.paymentMethod.currency) {
          ctrl.isNewLoaded = PaymentMethodService.add(ctrl.paymentMethod).then(function (paymentMethod) {
            return initMethod();
          });

          return ctrl.isNewLoaded;
        }
      };

      ctrl.deleteMethod = function(paymentMethod) {
        ctrl.isLoaded[paymentMethod.id] = PaymentMethodService.delete(paymentMethod);

        return ctrl.isLoaded[paymentMethod.id];
      };

      ctrl.updateSelectedColors = function() {
        ctrl.selectedColors = ctrl.paymentMethods.map(function(p) { return p.color; });
        if (ctrl.paymentMethod.color) {
          ctrl.selectedColors.push(ctrl.paymentMethod.color);
        }
      };
    }
  });
