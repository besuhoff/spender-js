angular.module('spender', ['restangular', 'ui.router', 'ui.bootstrap'])
  .constant('BACKEND_URL', 'http://spender.pereborstudio.dev:8090/')
  .constant('GAPI_CLIENT_ID', '843225840486-ilkj47kggue9tvh6ajfvvog45mertgfg.apps.googleusercontent.com')

  .config(function($locationProvider, $urlMatcherFactoryProvider, $stateProvider) {
    $locationProvider.html5Mode(true);

    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
      .state('login', {
        url: '/login',
        template: '<login-page></login-page>'
      })
      .state('authorized', {
        url: '',
        abstract: true,
        template: '<layout profile="profile"></layout>',
        controller: function($scope, profile) {
          $scope.profile = profile;
        },
        resolve: {
          profile: function(GapiService, $state, $q) {
            return GapiService.load().then(function(gapi) {
              var currentUser = gapi.auth2.getAuthInstance().currentUser.get();

              if (currentUser && currentUser.isSignedIn()) {
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
      .state('home', {
        url: '',
        parent: 'authorized',
        template: '<spent-page></spent-page>'
      });
  })
  .config(function(RestangularProvider, BACKEND_URL) {
    RestangularProvider.setBaseUrl(BACKEND_URL);
  });
