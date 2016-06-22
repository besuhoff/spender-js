angular.module('spender')
  .component('signin', {
    templateUrl: 'js/app/spender/signin/signin.html',
    controller: function($window, DataService, $scope, GapiService) {
      var ctrl = this;

      var backendUrl = 'http://spender.pereborstudio.dev:8090/';

      this.onSignIn = function(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        var id_token = googleUser.getAuthResponse().id_token;
        DataService.setToken(id_token);
        DataService.setProfile(profile);
      };

      this.onFailure = function(error) {
        console.log(error);
      };

      GapiService.load().then(function(gapi) {
        gapi.signin2.render('my-signin2', {
          scope: 'profile email',
          width: 140,
          height: 40,
          theme: 'dark',
          onsuccess: function(googleUser) {
            ctrl.onSignIn(googleUser);
            $scope.$apply();
          },
          onfailure: function() {
            ctrl.onFailure();
            $scope.$apply();
          }
        });
      });
    }
  });
