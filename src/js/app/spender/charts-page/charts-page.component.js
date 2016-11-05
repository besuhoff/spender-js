angular.module('spender')
  .component('chartsPage', {
    templateUrl: 'js/app/spender/charts-page/charts-page.html',
    controller: function(ChartService, IncomeService, ExpenseService, PaymentMethodService,
                         $scope) {
      var ctrl = this;

      function buildChart() {
        if (ctrl.expenses && ctrl.incomes && ctrl.paymentMethods) {
          ctrl.balanceChart = ChartService.buildBalanceChart(ctrl.expenses, ctrl.incomes, ctrl.paymentMethods);
        }
      }

      ctrl.hasChart = function() {
        return ctrl.balanceChart && Object.keys(ctrl.balanceChart).length > 0;
      };

      ctrl.paymentMethods = PaymentMethodService.getAll().filter(function(item) {
        return !item._isRemoved;
      });

      ctrl.incomes = IncomeService.getAll().filter(function(item) {
        return !item._isRemoved;
      });

      ctrl.expenses = ExpenseService.getAll().filter(function(item) {
        return !item._isRemoved;
      });

      buildChart();
    }
  });
