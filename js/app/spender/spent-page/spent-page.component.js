angular.module('spender')
  .component('spentPage', {
    templateUrl: 'js/app/spender/spent-page/spent-page.html',
    controller: function(DataService) {
      var ctrl = this;

      ctrl.paymentMethods = [];
      ctrl.categories = [];

      DataService.getPaymentMethods().then(function(paymentMethods) {
        ctrl.paymentMethods = paymentMethods;
      });

      DataService.getCategories().then(function(categories) {
        ctrl.categories = categories;
      });
    }
  });
