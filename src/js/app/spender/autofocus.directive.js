angular.module('spender')

  .directive('autofocus', function() {
    return {
      restrict: 'A',
      link : function($scope, $element) {
        $scope.$applyAsync(function() {
          $element[0].focus();
        });
      }
    }
  });