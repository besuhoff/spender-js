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

    this.getCategories = function() {
      return Restangular.all('categories').getList();
    };

    this.getIncomeCategories = function() {
      return Restangular.all('income-categories').getList();
    };

    this.saveExpense = function(data) {
      return Restangular.all('expenses').post(data);
    };

    this.saveIncome = function(data) {
      return Restangular.all('incomes').post(data);
    };
  });