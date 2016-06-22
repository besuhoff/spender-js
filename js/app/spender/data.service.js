angular.module('spender')
  .service('DataService', function(Restangular, $http) {
    var _profile;

    this.getProfile = function() {
      return _profile;
    };

    this.setProfile = function(profile) {
      _profile = profile;
    };

    this.setToken = function(token) {
      $http.defaults.headers.common['X-Auth-Token'] = token;
    };

    this.getPaymentMethods = function() {
      return Restangular.all('payment-methods').getList();
    }
  });