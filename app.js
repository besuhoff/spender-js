angular.module('spender', ['restangular', 'ui.router', 'ui.bootstrap'])
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

  })
  .service('GapiService', function($rootScope, $window, $q) {
    var _apiDeferred = $q.defer();

    $rootScope.$watch(
      function() { return $window.gapi },
      function() { _apiDeferred.resolve($window.gapi); }
    );

    this.load = function() {
      return _apiDeferred.promise;
    }
  })
  .component('layout', {
    templateUrl: 'layout.html',
    controller: function(DataService) {
      var ctrl = this;

      ctrl.getProfile = function() {
        return DataService.getProfile();
      };
    }
  })
  .component('signin', {
    templateUrl: 'signin.html',
    controller: function($window, DataService, $scope, GapiService) {
      var ctrl = this;

      var backendUrl = 'http://spender.pereborstudio.dev:8090/';

      this.onSignIn = function(googleUser) {
        // Useful data for your client-side scripts:
        var profile = googleUser.getBasicProfile();
        var id_token = googleUser.getAuthResponse().id_token;
        DataService.setToken(id_token);
        DataService.setProfile(profile);
      };

      this.onFailure = function(error) {
        console.log(error);
      };

      GapiService.load().then(function(gapi) {
        gapi.signin2.render('my-signin2', {
          scope: 'profile email',
          width: 140,
          height: 40,
          theme: 'dark',
          onsuccess: function(googleUser) {
            ctrl.onSignIn(googleUser);
            $scope.$apply();
          },
          onfailure: function() {
            ctrl.onFailure();
            $scope.$apply();
          }
        });
      });
    }
  })
  .config(function($locationProvider, $urlMatcherFactoryProvider, $stateProvider) {
    $locationProvider.html5Mode(true);

    $urlMatcherFactoryProvider.strictMode(false);

    $stateProvider
      .state('common', {
        url: '',
        template: '<layout></layout>'
      });
  });