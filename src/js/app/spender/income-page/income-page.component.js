angular.module('spender')
  .component('incomePage', {
    templateUrl: 'js/app/spender/income-page/income-page.html',
    controller: function(DataService, IncomeCategoryService, PaymentMethodService) {
      var ctrl = this;

      function initIncome() {
        ctrl.income = {
          amount: 0
        };
      }

      function initPaymentMethods() {
        PaymentMethodService.loadAll().then(function(paymentMethods) {
          ctrl.paymentMethods = paymentMethods;
        });
      }

      ctrl.paymentMethods = [];
      ctrl.categories = [];

      initPaymentMethods();

      IncomeCategoryService.loadAll().then(function(categories) {
        ctrl.categories = categories;
      });

      ctrl.save = function() {
        if (ctrl.income.incomeCategory && ctrl.income.paymentMethod) {
          ctrl.income.incomeCategoryId = ctrl.income.incomeCategory.id;
          ctrl.income.paymentMethodId = ctrl.income.paymentMethod.id;
          delete ctrl.income.incomeCategory;
          delete ctrl.income.paymentMethod;

          DataService.saveIncome(ctrl.income).then(function () {
            initIncome();
            initPaymentMethods();
          });
        }
      }
    }
  });
