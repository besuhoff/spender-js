angular.module('spender')
  .service('WizardService', function(UserService, $state, $timeout) {
    var isHintShown = {
      help: false
    };

    this.step = function() {
      return UserService.get() && UserService.get().wizardStep || -1;
    };

    this.isActive = function() {
      return this.step() !== -1;
    };

    this.hasModal = function() {
      return this.step() === 1;
    };

    this.isHelpHintVisible = function() {
      return isHintShown.help;
    };

    this.isCategoryHintVisible = function() {
      return this.step() === 2;
    };

    this.isPaymentMethodHintVisible = function() {
      return this.step() === 3;
    };

    this.isIncomeCategoryHintVisible = function() {
      return this.step() === 4;
    };

    this.isExpenseHintVisible = function() {
      return this.step() === 5;
    };

    this.isIncomeHintVisible = function() {
      return this.step() === 6;
    };

    this.isTransferHintVisible = function() {
      return this.step() === 7;
    };

    this.isHistoryHintVisible = function() {
      return this.step() === 8;
    };

    this.nextStep = function() {
      var service = this;

      return UserService.update({ wizardStep: this.step() + 1 }).then(function() {
        if (service.isCategoryHintVisible()) {
          $state.go('categories');
        }

        if (service.isPaymentMethodHintVisible()) {
          $state.go('payment-methods');
        }

        if (service.isIncomeCategoryHintVisible()) {
          $state.go('income-categories');
        }

        if (service.isExpenseHintVisible()) {
          $state.go('expenses');
        }

        if (service.isIncomeHintVisible()) {
          $state.go('income');
        }

        if (service.isTransferHintVisible()) {
          $state.go('transfers');
        }

        if (service.isHistoryHintVisible()) {
          $state.go('history');
        }
      });
    };

    this.reset = function() {
      return UserService.update({ wizardStep: 1 });
    };

    this.close = function() {
      return UserService.update({ wizardStep: -1 }).then(function() {
        isHintShown.help = true;

        $timeout(function() {
          isHintShown.help = false;
        }, 5000)
      });
    };
  });