angular.module('spender', ['restangular', 'ui.router', 'ui.bootstrap'])
  .constant('BACKEND_URL', 'http://spender.pereborstudio.dev:8090/')
  .constant('GAPI_CLIENT_ID', '843225840486-ilkj47kggue9tvh6ajfvvog45mertgfg.apps.googleusercontent.com')

  .config(function($locationProvider, $urlRouterProvider, $transitionsProvider, $urlMatcherFactoryProvider, $stateProvider) {
    $locationProvider.html5Mode(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $urlRouterProvider.otherwise('/');

    // BEGIN ABSTRACT REDIRECT
    $transitionsProvider.onStart({ to: function(state) { return !!state.redirectTo; } }, function($transition$, $state) {
      var val = $transition$.to().redirectTo;
      return $state.go(val, $transition$.params());
    });
    // END ABSTRACT REDIRECT


    $stateProvider
      .state('login', {
        url: '/login',
        template: '<login-page></login-page>'
      })
      .state('home', {
        url: '',
        redirectTo: 'home.expenses',
        template: '<layout profile="profile"></layout>',
        controller: function($scope, profile) {
          $scope.profile = profile;
        },
        resolve: {
          profile: function(DataService, GapiService, $state, $q) {
            return GapiService.load().then(function(gapi) {
              var currentUser = gapi.auth2.getAuthInstance().currentUser.get();

              if (currentUser && currentUser.isSignedIn()) {
                var id_token = currentUser.getAuthResponse().id_token;
                DataService.setToken(id_token);
                DataService.setProfile(currentUser.getBasicProfile());

                return currentUser.getBasicProfile();
              } else {
                return $q.reject('User is not authenticated');
              }
            })
            .catch(function() {
              $state.go('login');
            });
          }
        }
      })
      .state('home.expenses', {
        url: '/expenses',
        template: '<expenses-page></expenses-page>'
      })
      .state('home.income', {
        url: '/income',
        template: '<income-page></income-page>'
      });
  })
  .config(function(RestangularProvider, BACKEND_URL) {
    RestangularProvider.setBaseUrl(BACKEND_URL);
  });
