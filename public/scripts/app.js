angular.module('gitfitApp',
[
  'ngRoute',
  'ngCookies',
  'gitfitApp.service.user',
  'gitfitApp.controller.profile',
  'gitfitApp.controller.header',
  'gitfitApp.controller.create',
  'gitfitApp.controller.CritterCreateCtrl',
  'gitfitApp.directive.header'
])
.config(function($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html'
    })
    .when('/critter/create', {
      templateUrl: 'views/create.html',
      controller: 'CreateCtrl'
    })
    .when('/critter/:username', {
      templateUrl: 'views/profile.html',
      controller: 'ProfileCtrl'
    })
    .when('/create', {
        templateUrl: 'views/create.html',
        controller: 'CritterCreateCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
  $httpProvider.interceptors.push('authInterceptor');
})
.factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
  return {
    // Add authorization token to headers
    request: function (config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError: function(response) {
      if(response.status === 401) {
        $location.path('/login');
        // remove any stale tokens
        $cookieStore.remove('token');
        return $q.reject(response);
      }
      else {
        return $q.reject(response);
      }
    }
  };
})

