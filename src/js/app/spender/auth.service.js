angular.module('spender')
  .service('AuthService', function(Restangular, $http,
                                   CategoryService, ExpenseService, IncomeService, IncomeCategoryService, PaymentMethodService) {
    var _profile;

    this.getProfile = function() {
      return _profile;
    };

    this.setProfile = function(profile) {
      _profile = profile;

      [CategoryService, ExpenseService, IncomeService, IncomeCategoryService, PaymentMethodService].forEach(function(service) {
        service.resetAll();
      });
    };

    this.setToken = function(token) {
      $http.defaults.headers.common['X-Auth-Token'] = token;
    };
  });