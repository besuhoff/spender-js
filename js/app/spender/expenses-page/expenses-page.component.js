angular.module('spender')
  .component('expensesPage', {
    templateUrl: 'js/app/spender/expenses-page/expenses-page.html',
    controller: function(DataService, PaymentMethodService) {
      var ctrl = this;

      function initExpense() {
        ctrl.spent = {
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

      DataService.getCategories().then(function(categories) {
        ctrl.categories = categories;
      });

      ctrl.save = function() {
        if (ctrl.spent.Category && ctrl.spent.PaymentMethod) {
          ctrl.spent.CategoryId = ctrl.spent.Category.Id;
          ctrl.spent.PaymentMethodId = ctrl.spent.PaymentMethod.Id;
          delete ctrl.spent.Category;
          delete ctrl.spent.PaymentMethod;

          DataService.saveExpense(ctrl.spent).then(function() {
            initExpense();
            initPaymentMethods();
          });
        }
      }
    }
  });
