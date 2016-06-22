angular.module('spender')
  .component('layout', {
    templateUrl: 'js/app/spender/layout/layout.html',
    controller: function(DataService) {
      var ctrl = this;

      ctrl.getProfile = function() {
        return DataService.getProfile();
      };
    }
  });
