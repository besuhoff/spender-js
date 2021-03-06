angular.module('spender')
  .component('signin', {
    templateUrl: 'js/app/spender/signin/signin.html',
    controller: function($window, AuthService, $scope, GapiService, LoginService, $element) {
      var ctrl = this;

      GapiService.load().then(function(gapi) {
        gapi.auth2.getAuthInstance().attachClickHandler($element[0], {},
          function(googleUser) {
            // Useful data for your client-side scripts:
            var profile = googleUser.getBasicProfile();
            AuthService.setProfile(profile);

            LoginService.hideForm();

            $scope.$apply();
          },

          function(error) {
            console.log(error);
          });
      });
    }
  });
