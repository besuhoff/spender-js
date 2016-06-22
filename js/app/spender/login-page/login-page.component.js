angular.module('spender')
  .component('loginPage', {
    templateUrl: 'js/app/spender/login-page/login-page.html',
    controller: function($scope, $state, DataService) {
      $scope.$watch(
        function() { return DataService.getProfile() },
        function(profile) { if (profile) { $state.go('home') } }
      );
    }
  });
