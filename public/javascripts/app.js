var app = angular.module('bonVoyage', ['ngResource', 'ngRoute', 'UserApp','UserApp.facebook-picture','leaflet-directive']);

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
            public: true
        })
        .when('/login', {
            templateUrl: 'templates/login.html',
            public: true
        })
        .when('/user', {
            templateUrl: 'templates/user.html',
            controller: 'UserCtrl'
        })
        .when('/user-edit/:id', {
            templateUrl: 'templates/user-form.html',
            controller: 'EditUserCtrl'
        })
        .when('/travelGuides', {
            templateUrl: 'templates/travelGuides.html',
            controller: 'TravelGuidesCtrl'
        })
        .when('/travelGuide/:id', {
            templateUrl: 'templates/travelGuide.html',
            controller: 'TravelGuideCtrl'
        })
        .when('/travelGuide-form/:city_id', {
            templateUrl: 'templates/travelGuide-form.html',
            controller: 'AddTravelGuideCtrl'
        })
        .when('/travelGuide-edit-form/:id', {
            templateUrl: 'templates/travelGuide-edit-form.html',
            controller: 'EditTravelGuideCtrl'
        })
        .when('/recommend', {
            templateUrl: 'templates/recommend.html',
            controller: 'RecommendCtrl'
        })
        .otherwise({
            public: true,
            redirectTo: '/'
        });
}]);

app.run(function($rootScope, user) {
    user.init({ appId: '561c1ea4dac46' });
});