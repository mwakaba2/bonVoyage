var app = angular.module('bonVoyage', ['ngResource', 'ngRoute', 'UserApp']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            public: true,
            redirectTo: '/cities'
        })
        .when('/cities', {
            public: true,
            templateUrl: 'templates/cities.html',
            controller: 'CitiesCtrl'
        })
        .when('/city/:id', {
            public: true,
            templateUrl: 'templates/city.html',
            controller: 'CityCtrl'
        })
        .when('/signup', {
            templateUrl: 'templates/signup.html',
            public: true,
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            public: true
        })
        .when('/user', {
            templateUrl: 'templates/user.html',
            controller: 'UserCtrl'
        })
        .otherwise({
            public: true,
            redirectTo: '/'
        });
}]);

app.run(function($rootScope, user) {
    user.init({ appId: '5619bd59cca34' });
});
