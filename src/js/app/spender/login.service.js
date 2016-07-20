angular.module('spender')
  .service('LoginService', function() {
    var _isFormVisible = false;

    this.isFormVisible = function() {
      return _isFormVisible;
    };

    this.showForm = function() {
      _isFormVisible = true;
    };

    this.hideForm = function() {
      _isFormVisible = false;
    };
  });