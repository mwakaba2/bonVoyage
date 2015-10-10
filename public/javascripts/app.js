var app = angular.module('bonVoyage', ['ngResource', 'ngRoute']);

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
            templateUrl: 'templates/signup.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);