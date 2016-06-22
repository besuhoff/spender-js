angular.module('spender')
  .component('spentPage', {
    templateUrl: 'js/app/spender/spent-page/spent-page.html',
    controller: function() {
      this.paymentMethods = [];
      this.categories = [];
    }
  });
