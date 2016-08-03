angular.module('spender')
  .component('paymentMethodsPage', {
    templateUrl: 'js/app/spender/payment-methods-page/payment-methods-page.html',
    controller: function(PaymentMethodService, CurrencyService, WizardService) {
      var ctrl = this;

      function initMethods() {
        ctrl.paymentMethods = PaymentMethodService.getAll().filter(function(item) { return !item._isRemoved; });
      }

      ctrl.saveMethod = function(paymentMethod) {
        if (paymentMethod.name && paymentMethod.currency) {
          ctrl.isLoaded[paymentMethod.id] = PaymentMethodService.update(paymentMethod).then(function() {
            initMethods();
          });

          return ctrl.isLoaded[paymentMethod.id];
        }
      };

      ctrl.addMethod = function() {
        if (ctrl.paymentMethod.name && ctrl.paymentMethod.currency) {
          ctrl.isNewLoaded = PaymentMethodService.add(ctrl.paymentMethod).then(function (paymentMethod) {
            initMethods();
            return initMethod();
          });

          return ctrl.isNewLoaded;
        }
      };

      ctrl.deleteMethod = function(paymentMethod) {
        ctrl.isLoaded[paymentMethod.id] = PaymentMethodService.delete(paymentMethod).then(function() {
          initMethods();
        });

        return ctrl.isLoaded[paymentMethod.id];
      };

      ctrl.updateSelectedColors = function() {
        ctrl.selectedColors = ctrl.paymentMethods.map(function(p) { return p.color; });
        if (ctrl.paymentMethod.color) {
          ctrl.selectedColors.push(ctrl.paymentMethod.color);
        }
      };

      function initMethod() {
        ctrl.paymentMethod = {
          initialAmount: 0
        };
        ctrl.isNewLoaded = undefined;
      }

      initMethod();
      initMethods();

      ctrl.isLoaded = {};
      ctrl.updateSelectedColors();

      ctrl.currencies = CurrencyService.getAll();

      ctrl.isHintVisible = function() {
        return WizardService.isPaymentMethodHintVisible();
      };

      ctrl.nextStep = function() {
        ctrl.loading = true;

        return WizardService.nextStep().finally(function() {
          ctrl.loading = false;
        })
      };

      ctrl.close = function() {
        ctrl.loading = true;

        return WizardService.close().finally(function() {
          ctrl.loading = false;
        })
      };
    }
  });
