var app = angular.module('bonVoyage', ['ngResource', 'ngRoute', 'UserApp']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/cities'
        })
        .when('/cities', {
            templateUrl: 'templates/cities.html',
            controller: 'CitiesCtrl'
        })
        .when('/city/:id', {
            templateUrl: 'templates/city.html',
            controller: 'CityCtrl'
        })
        .when('/signup', {
            templateUrl: 'templates/signup.html',
            public: true,
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            public: true,
            login: true
        })
        .when('/user', {
            templateUrl: 'templates/user.html',
            controller: 'UserCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.run(function($rootScope, user) {
    user.init({ appId: '5619bd59cca34' });
});
