app.controller('CitiesCtrl', function ($scope, $resource, Api) {
    Api.getCities().then(
        function (data) {
            $scope.cities = data;
        },
        function (error) {
            // TODO: error handling
        }
    );

    //var cities = $resource('/api/cities');
    //cities.query(function (cities) {
    //    $scope.cities = cities;
    //});
});

app.controller('CityCtrl', function ($scope, $resource, $routeParams) {
    var city = $resource(
        '/api/cities/:id',
        {id: $routeParams.id},
        {query: {isArray: false}}
    );
    city.query(function (result) {
        $scope.city = result;
    });
    var travelGuides = $resource(
        '/api/cities/:id/travelGuides',
        {id: $routeParams.id}
    );
    travelGuides.query(function (result) {
        $scope.travelGuides = result;
    })
});

//app.controller('AddCityCtrl', ['$scope', '$resource', '$location',
//    function($scope, $resource, $location){
//        $scope.save = function(){
//            var Cities = $resource('/api/cities');
//            Cities.save($scope.city, function(){
//                $location.path('/');
//            });
//        };
//    }]);
//
//app.controller('EditCityCtrl', ['$scope', '$resource', '$location', '$routeParams',
//    function($scope, $resource, $location, $routeParams){
//        var Cities = $resource('/api/cities/:id', { id: '@_id' }, {
//            update: { method: 'PUT' }
//        });
//
//        Cities.get({ id: $routeParams.id }, function(city){
//            $scope.city = city;
//        });
//
//        $scope.save = function(){
//            Cities.update($scope.city, function(){
//                $location.path('/');
//            });
//        }
//    }]);
//
//app.controller('DeleteCityCtrl', ['$scope', '$resource', '$location', '$routeParams',
//    function($scope, $resource, $location, $routeParams){
//        var Cities = $resource('/api/cities/:id');
//
//        Cities.get({ id: $routeParams.id }, function(city){
//            $scope.city = city;
//        })
//
//        $scope.delete = function(){
//            Cities.delete({ id: $routeParams.id }, function(city){
//                $location.path('/');
//            });
//        }
//    }]);