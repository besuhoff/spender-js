angular.module('spender', ['restangular', 'ui.router', 'ui.bootstrap'])
  .config(function($locationProvider, $urlMatcherFactoryProvider, $stateProvider) {
    $locationProvider.html5Mode(true);

    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
      .state('common', {
        url: '',
        template: '<layout></layout>'
      });
  });