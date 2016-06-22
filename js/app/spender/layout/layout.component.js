angular.module('spender')
  .component('layout', {
    templateUrl: 'js/app/spender/layout/layout.html',
    bindings: {
      profile: '='
    },
    controller: function(GapiService, $state) {
      this.signOut = function() {
        GapiService.load().then(function(gapi) {
          gapi.auth2.getAuthInstance().signOut().then(function() {
            $state.go('login');
          });
        });
      }
    }
  });
