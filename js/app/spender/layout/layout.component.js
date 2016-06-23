angular.module('spender')
  .component('layout', {
    templateUrl: 'js/app/spender/layout/layout.html',
    bindings: {
      profile: '='
    },
    controller: function(GapiService, DataService, $state, $scope) {
      var ctrl = this;

      ctrl.signOut = function() {
        GapiService.load().then(function(gapi) {
          gapi.auth2.getAuthInstance().signOut().then(function() {
            $state.go('login');
          });
        });
      };

      $scope.$watch(
        function() {
          return DataService.getPaymentMethods()
        },
        function(paymentMethods) {
          ctrl.paymentMethods = paymentMethods;
        }
      );
    }
  });
