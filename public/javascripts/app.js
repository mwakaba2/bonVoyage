var app = angular.module('bonVoyage', ['ngResource','ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-city', {
            templateUrl: 'templates/city-form.html',
            controller: 'AddCityCtrl'
        })
        .when('/city/:id', {
            templateUrl: 'templates/city-form.html',
            controller: 'EditCityCtrl'
        })
        .when('/city/delete/:id', {
            templateUrl: 'templates/city-delete.html',
            controller: 'DeleteCityCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);




