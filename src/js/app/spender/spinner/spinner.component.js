angular.module('spender')
  .component('spinner', {
    bindings: {
      isLoaded: '='
    },
    templateUrl: 'js/app/spender/spinner/spinner.html',
    controller: function($scope, $timeout) {
      var ctrl = this;

      $scope.$watch('$ctrl.isLoaded', function(isLoaded) {
        if (isLoaded) {
          ctrl.isPending = true;
          isLoaded.then(function() {
            $timeout(function() {
              ctrl.isPending = false;
              ctrl.isSaved = true;
            }, 500).then(function() {
              $timeout(function() {
                ctrl.isSaved = false;
              }, 500);
            });
          }).catch(function() {
            ctrl.isPending = false;
          });
        }
      });
    }
  });