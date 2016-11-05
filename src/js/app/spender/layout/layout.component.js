angular.module('spender')
  .component('layout', {
    templateUrl: 'js/app/spender/layout/layout.html',
    controller: function(GapiService, LoginService, AuthService, PaymentMethodService, WizardService, UserService,
                         $state, $scope, $rootScope) {
      var ctrl = this;
      ctrl.paymentMethods = false;

      $scope.$watch(
        function() {
          return PaymentMethodService.getListChangedAt();
        },
        function() {
          ctrl.paymentMethods = PaymentMethodService.getAll().filter(function(item) {
            return !item._isRemoved;
          });
        }
      );

      ctrl.getProfile = function() {
        return AuthService.getProfile();
      };

      ctrl.signOut = function() {
        GapiService.load().then(function(gapi) {
          gapi.auth2.getAuthInstance().signOut().then(function() {
            AuthService.reset();
            UserService.reset();

            $state.go('login');
          });
        });
      };

      $scope.$watch(
        function() {
          return ctrl.isLoginFormVisible() || ctrl.isWizardModalVisible();
        },
        function(value) {
          $rootScope.hasModal = value;
        }
      );

      ctrl.isLoginFormVisible = function() {
        return LoginService.isFormVisible();
      };

      ctrl.isWizardModalVisible = function() {
        return WizardService.hasModal();
      };

      ctrl.resetWizard = function() {
        return WizardService.reset();
      };

      $scope.$watch(
        function() {
          return WizardService.isHelpHintVisible();
        },
        function(value) {
          angular.element('#main_menu_help').popover(value ? 'show' : 'hide');
        }
      );
    }
  });
