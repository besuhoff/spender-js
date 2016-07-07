angular.module('spender')
  .component('incomePage', {
    templateUrl: 'js/app/spender/income-page/income-page.html',
    controller: function(IncomeService, ChartService, IncomeCategoryService, PaymentMethodService) {
      var ctrl = this;

      function initIncome() {
        ctrl.income = {
          createdAt: moment().format()
        };
      }

      function initIncomes(reload) {
        IncomeService.loadAll(reload).then(function(incomes) {
          ctrl.incomes = incomes;
          ctrl.incomesChart = ChartService.buildTransactionsChart(incomes);
        });
      }

      function initPaymentMethods(reload) {
        PaymentMethodService.loadAll(reload).then(function(paymentMethods) {
          ctrl.paymentMethods = paymentMethods;
        });
      }

      ctrl.paymentMethods = [];
      ctrl.categories = [];
      ctrl.incomes = [];

      initIncome();
      initIncomes();
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

          IncomeService.add(ctrl.income).then(function () {
            initIncome();
            initIncomes(true);
            initPaymentMethods(true);
          });
        }
      }
    }
  });
