angular.module('spender')
  .service('DataService', function(Restangular, $http) {
    var _profile;

    var _paymentMethods = [];

    this.getProfile = function() {
      return _profile;
    };

    this.setProfile = function(profile) {
      _profile = profile;
    };

    this.setToken = function(token) {
      $http.defaults.headers.common['X-Auth-Token'] = token;
    };

    this.loadPaymentMethods = function() {
      return Restangular.all('payment-methods').getList().then(function(paymentMethods) {
        _paymentMethods = paymentMethods;
        return _paymentMethods;
      });
    };

    this.getPaymentMethods = function() {
      return _paymentMethods;
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

    this.addPaymentMethod = function(data) {
      return Restangular.all('payment-methods').post(data);
    };

    this.updatePaymentMethod = function(data) {
      return Restangular.one('payment-methods', data.Id).patch(data);
    };

    this.deletePaymentMethod = function(data) {
      return Restangular.one('payment-methods', data.Id).remove();
    };
  });