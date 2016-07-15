angular.module('spender')
  .component('incomePage', {
    bindings: {
      income: '=?'
    },
    templateUrl: 'js/app/spender/income-page/income-page.html',
    controller: function($state, moment, IncomeService, ChartService, IncomeCategoryService, PaymentMethodService) {
      var ctrl = this;

      ctrl.editMode = false;

      function initIncome() {
        ctrl.income = {
          createdAt: (ctrl.income ? moment(ctrl.income.createdAt).add(1, 'seconds') : moment()).format()
        };
      }

      function initIncomes() {
        ctrl.incomes = IncomeService.getAll().filter(function(item) { return !item._isRemoved; });
        ctrl.incomesChart = ChartService.buildTransactionsChart(ctrl.incomes);
      }

      initIncomes();
      if (!ctrl.income) {
        initIncome();
      } else {
        ctrl.income.paymentMethod = PaymentMethodService.getOne(ctrl.income.paymentMethodId);
        ctrl.income.incomeCategory = IncomeCategoryService.getOne(ctrl.income.incomeCategoryId);
        ctrl.editMode = true;
      }

      ctrl.paymentMethods = PaymentMethodService.getAll().filter(function(item) { return !item._isRemoved; });
      ctrl.categories = IncomeCategoryService.getAll().filter(function(item) { return !item._isRemoved; });

      ctrl.save = function() {
        if (ctrl.income.incomeCategory && ctrl.income.paymentMethod) {
          IncomeService[!ctrl.editMode ? 'add' : 'update'](ctrl.income).then(function () {
            if (ctrl.editMode) {
              $state.go('income');
            } else {
              initIncome();
              initIncomes();
            }
          });
        }
      };

      ctrl.hasChart = function() {
        return ctrl.incomesChart && Object.keys(ctrl.incomesChart).length > 0;
      };
    }
  });
