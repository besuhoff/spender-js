angular.module('spender')
  .service('AuthService', function(Restangular, $http, CacheService, UserService) {
    var _profile;

    this.getProfile = function() {
      return _profile;
    };

    this.setProfile = function(profile) {
      return UserService.create().then(function() {
        return CacheService.loadAll(true);
      }).then(function() {
        _profile = profile;
        return profile;
      });
    };

    this.setToken = function(token) {
      $http.defaults.headers.common['X-Auth-Token'] = token;
    };
  });