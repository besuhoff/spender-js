angular.module('spender')
  .service('UserService', function Service(Restangular) {
    var _user;

    this.create = function() {
      return Restangular.all('users').post({}).then(function(user) {
        _user = user;
      });
    };

    this.update = function(data) {
      return Restangular.one('user').patch(data).then(function(user) {
        _user = user;
      });
    };

    this.get = function() {
      return _user;
    };

    this.reset = function() {
      _user = undefined;
    }
  });
