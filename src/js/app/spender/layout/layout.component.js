angular.module('spender')
  .component('layout', {
    templateUrl: 'js/app/spender/layout/layout.html',
    controller: function(GapiService, ChartService, IncomeService, ExpenseService, PaymentMethodService, LoginService, AuthService,
                         $state, $scope) {
      var ctrl = this;

      ctrl.paymentMethods = false;
      ctrl.incomes = false;
      ctrl.expenses = false;

      function buildChart() {
        if (ctrl.expenses && ctrl.incomes && ctrl.paymentMethods) {
          ctrl.balanceChart = ChartService.buildBalanceChart(ctrl.expenses, ctrl.incomes, ctrl.paymentMethods);
        }
      }

      ctrl.getProfile = function() {
        return AuthService.getProfile();
      };

      ctrl.signOut = function() {
        GapiService.load().then(function(gapi) {
          gapi.auth2.getAuthInstance().signOut().then(function() {
            $state.go('login');
          });
        });
      };

      ctrl.hasChart = function() {
        return ctrl.balanceChart && Object.keys(ctrl.balanceChart).length > 0;
      };

      $scope.$watch(
        function() {
          return PaymentMethodService.getListChangedAt();
        },
        function(newDate, oldDate) {
          if (newDate !== oldDate) {
            ctrl.paymentMethods = PaymentMethodService.getAll().filter(function (item) {
              return !item._isRemoved;
            });
            buildChart();
          }
        }
      );

      $scope.$watch(
        function() {
          return IncomeService.getListChangedAt();
        },
        function(newDate, oldDate) {
          if (newDate !== oldDate) {
            ctrl.incomes = IncomeService.getAll().filter(function (item) {
              return !item._isRemoved;
            });
            buildChart();
          }
        }
      );

      $scope.$watch(
        function() {
          return ExpenseService.getListChangedAt();
        },
        function(newDate, oldDate) {
          if (newDate !== oldDate) {
            ctrl.expenses = ExpenseService.getAll().filter(function(item) {
              return !item._isRemoved;
            });
            buildChart();
          }
        }
      );

      ctrl.isLoginFormVisible = function() {
        return LoginService.isFormVisible();
      }
    }
  });
