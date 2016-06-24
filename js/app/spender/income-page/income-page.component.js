angular.module('spender')
  .component('incomePage', {
    templateUrl: 'js/app/spender/income-page/income-page.html',
    controller: function(DataService, PaymentMethodService) {
      var ctrl = this;

      function initIncome() {
        ctrl.income = {
          Amount: 0
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

      DataService.getIncomeCategories().then(function(categories) {
        ctrl.categories = categories;
      });

      ctrl.save = function() {
        if (ctrl.income.IncomeCategory && ctrl.income.PaymentMethod) {
          ctrl.income.IncomeCategoryId = ctrl.income.IncomeCategory.Id;
          ctrl.income.PaymentMethodId = ctrl.income.PaymentMethod.Id;
          delete ctrl.income.IncomeCategory;
          delete ctrl.income.PaymentMethod;

          DataService.saveIncome(ctrl.income).then(function () {
            initIncome();
            initPaymentMethods();
          });
        }
      }
    }
  });
