angular.module('spender')
  .component('loginPage', {
    templateUrl: 'js/app/spender/login-page/login-page.html',
    controller: function($scope, $state, AuthService) {
      $scope.$watch(
        function() { return AuthService.getProfile() },
        function(profile) { if (profile) { $state.go('home') } }
      );
    }
  });
