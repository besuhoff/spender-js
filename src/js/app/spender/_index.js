angular.module(
  'spender',
  [
    'restangular',
    'ui.router',
    'ui.bootstrap',
    'angularMoment',
    'ngAnimate',
    'templates',
    'chart.js'
  ])
  .constant('BACKEND_URL', 'https://spender-api.pereborstudio.com/')
  .constant('GAPI_CLIENT_ID', '843225840486-ilkj47kggue9tvh6ajfvvog45mertgfg.apps.googleusercontent.com')

  .controller('AppController', function($rootScope) {
    this.hasModal = function() {
      return $rootScope.hasModal;
    }
  })

  .config(function($locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $stateProvider) {
    $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/login',
        template: '<login-page></login-page>',
        resolve: {
          profile: function(AuthService, GapiService, $state, $q) {
            return GapiService.load().then(function(gapi) {
              var currentUser = gapi.auth2.getAuthInstance().currentUser.get();

              if (currentUser && currentUser.isSignedIn()) {
                $state.go('home');
              }
            });
          }
        }
      })
      .state('home', {
        url: '',
        template: '<layout></layout>',
        resolve: {
          profile: function(AuthService, GapiService, $state, $q) {
            return GapiService.load().then(function(gapi) {
              var currentUser = gapi.auth2.getAuthInstance().currentUser.get();

              if (currentUser && currentUser.isSignedIn()) {
                var id_token = currentUser.getAuthResponse().id_token;
                return AuthService.setProfile(currentUser.getBasicProfile());
              } else {
                return $q.reject('User is not authenticated');
              }
            })
            .catch(function() {
              $state.go('login');
            });
          },
          redirect: function(WizardService, $state, $stateParams, profile) {
            if ($state.toState.name === 'home') {
              if (WizardService.isActive()) {
                WizardService.goToCurrentHint();
              } else {
                $state.go('expenses', $stateParams);
              }
            }
          }
        }
      })
      .state('expenses', {
        parent: 'home',
        url: '/expenses',
        template: '<expenses-page></expenses-page>'
      })
      .state('income', {
        parent: 'home',
        url: '/income',
        template: '<income-page></income-page>'
      })
      .state('income-edit', {
        parent: 'home',
        url: '/income/:id',
        template: '<income-page income="income"></income-page>',
        controller: function($scope, income) {
          $scope.income = income;
        },
        resolve: {
          income: function($stateParams, IncomeService) {
            return IncomeService.getOne(+$stateParams.id);
          }
        }
      })
      .state('expense-edit', {
        parent: 'home',
        url: '/expenses/:id',
        template: '<expenses-page expense="expense"></expenses-page>',
        controller: function($scope, expense) {
          $scope.expense = expense;
        },
        resolve: {
          expense: function($stateParams, ExpenseService) {
            return ExpenseService.getOne(+$stateParams.id);
          }
        }
      })
      .state('transfers', {
        parent: 'home',
        url: '/transfers',
        template: '<transfers-page></transfers-page>'
      })
      .state('transfer-edit', {
        parent: 'home',
        url: '/transfers/:id',
        template: '<transfers-page income="income" expense="expense"></transfers-page>',
        controller: function($scope, income, expense) {
          $scope.income = income;
          $scope.expense = expense;
        },
        resolve: {
          income: function($stateParams, IncomeService) {
            return IncomeService.getOne(+$stateParams.id);
          },
          expense: function($stateParams, ExpenseService, income) {
            return income.sourceExpense;
          }
        }
      })
      .state('history', {
        parent: 'home',
        url: '/history?month',
        controller: function($stateParams, $scope) {
          $scope.currentMonth = $stateParams.month;
        },
        template: '<history-page current-month="currentMonth"></history-page>'
      })
      .state('categories', {
        parent: 'home',
        url: '/categories',
        template: '<categories-page></categories-page>'
      })
      .state('income-categories', {
        parent: 'home',
        url: '/income-categories',
        template: '<income-categories-page></income-categories-page>'
      })
      .state('charts', {
        parent: 'home',
        url: '/charts',
        template: '<charts-page></charts-page>'
      })
      .state('payment-methods', {
        parent: 'home',
        url: '/payment-methods',
        template: '<payment-methods-page></payment-methods-page>'
      });
  })
  .config(function(RestangularProvider, BACKEND_URL) {
    RestangularProvider
      .setBaseUrl(BACKEND_URL);
  })
  .config(function(ChartJsProvider) {
    ChartJsProvider.setOptions('Line', {
      defaultFontFamily: '"Fira Sans", sans-serif'
    });
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, LoginService, GapiService) {
      return {
        'request': function(config) {
          var id_token, gapi = GapiService.get();

          if (gapi && gapi.auth2) {
            var currentUser = gapi.auth2.getAuthInstance().currentUser.get();

            if (currentUser && currentUser.isSignedIn()) {
              id_token = currentUser.getAuthResponse().id_token;
            }
          }

          config.headers['X-Auth-Token'] = id_token;

          return config;
        },
        'responseError': function(errorResponse) {
          switch (errorResponse.status) {
            case 403:
              LoginService.showForm();
              break;
          }
          return $q.reject(errorResponse);
        }
      };
    });
  })

  .run(function($transitions, $state, $rootScope, CacheService) {
    $transitions.onStart({ to: true }, /* @ngInject */resolveSetTargetState);

    function resolveSetTargetState($transition$) {
      $state.toState = $transition$.$to();

      return true;
    }

    $rootScope.itemsLoaded = CacheService.loaded;
    $rootScope.itemsToLoad = Object.keys(CacheService.loaded);
  });