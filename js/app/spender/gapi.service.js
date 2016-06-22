angular.module('spender')
  .service('GapiService', function($rootScope, $window, $q, GAPI_CLIENT_ID) {
    var _apiDeferred = $q.defer(),
      _auth;

    $rootScope.$watch(
      function() { return $window.gapi },
      function(gapi) {
        if (gapi) {
          gapi.load('auth2', function() {
            gapi.auth2.init({
              client_id: GAPI_CLIENT_ID
            }).then(function() {
              _apiDeferred.resolve(gapi);
            });
          });
        }
      }
    );

    this.load = function() {
      return _apiDeferred.promise;
    };
  });
