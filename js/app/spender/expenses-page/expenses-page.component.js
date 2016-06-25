angular.module('spender')
  .component('expensesPage', {
    templateUrl: 'js/app/spender/expenses-page/expenses-page.html',
    controller: function(DataService, CategoryService, PaymentMethodService) {
      var ctrl = this;

      function initExpense() {
        ctrl.spent = {
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

      CategoryService.loadAll().then(function(categories) {
        ctrl.categories = categories;
      });

      ctrl.save = function() {
        if (ctrl.spent.category && ctrl.spent.paymentMethod) {
          ctrl.spent.categoryId = ctrl.spent.category.id;
          ctrl.spent.paymentMethodId = ctrl.spent.paymentMethod.id;
          delete ctrl.spent.category;
          delete ctrl.spent.paymentMethod;

          DataService.saveExpense(ctrl.spent).then(function() {
            initExpense();
            initPaymentMethods();
          });
        }
      }
    }
  });
