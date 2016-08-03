angular.module('spender')
  .component('wizard', {
    templateUrl: 'js/app/spender/wizard/wizard.html',
    controller: function(WizardService) {
      var ctrl = this;

      ctrl.nextStep = function() {
        ctrl.loading = true;

        return WizardService.nextStep().finally(function() {
          ctrl.loading = false;
        })
      };

      ctrl.close = function() {
        ctrl.loading = true;

        return WizardService.close().finally(function() {
          ctrl.loading = false;
        })
      };
    }
  });
