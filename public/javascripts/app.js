var app = angular.module('bonVoyage', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        })
        .when('/cities', {
            templateUrl: 'templates/cities.html',
            controller: 'CitiesCtrl'
        })
        .when('/city/:id', {
            templateUrl: 'templates/city.html',
            controller: 'CityCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', function ($scope, $resource) {
    //var Cities = $resource('/api/cities');
    //Cities.query(function (cities) {
    //    $scope.cities = cities;
    //});
});