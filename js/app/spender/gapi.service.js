angular.module('spender')
  .service('GapiService', function($rootScope, $window, $q) {
    var _apiDeferred = $q.defer();

    $rootScope.$watch(
      function() { return $window.gapi },
      function() { _apiDeferred.resolve($window.gapi); }
    );

    this.load = function() {
      return _apiDeferred.promise;
    }
  });
