app.controller('CitiesCtrl', function ($scope, Api) {
    Api.getCities().then(
        function (data) {
            $scope.cities = data;
        },
        function (error) {
            // TODO: error handling
        }
    );
});

app.controller('CityCtrl', function ($scope, $routeParams, Api, leafletData, leafletBoundsHelpers, user, UserApp) {
    angular.extend($scope, {
        center : {},
        layers: {
            baselayers: {
                googleRoadmap: {
                    name: 'Google Streets',
                    layerType: 'ROADMAP',
                    type: 'google'
                },
                googleTerrain: {
                    name: 'Google Terrain',
                    layerType: 'TERRAIN',
                    type: 'google'
                },
                googleHybrid: {
                    name: 'Google Hybrid',
                    layerType: 'HYBRID',
                    type: 'google'
                }
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    Api.getCityById($routeParams.id).then(
        function (data) {
            $scope.city = data;
            var geocode = $scope.city.geocode;
            var bounds = leafletBoundsHelpers.createBoundsFromArray([
                [geocode[0], geocode[1]],
                [geocode[2], geocode[3]]
            ]);
            
            angular.extend($scope, {
                bounds : bounds,
                maxBounds: bounds,
                paths: {
                    circle: {
                        type: 'circleMarker',
                        latlngs: {
                            lat: geocode[0],
                            lng: geocode[3]
                        },
                        color: '#ff612f',
                        weight: 2,
                        radius: 100
                    }
                }
            });

            if (user.current.authenticated) {
                user.getCurrent().then(function (currentUser) {
                    var bookmarked_cities = JSON.parse(currentUser.properties.bookmarked_cities.value);
                    $scope.bookmarked = bookmarked_cities.indexOf($scope.city.name) !== -1;

                    $scope.toggleBookmark = function () {
                        user.getCurrent().then(function (currentUser) {
                            var bookmarked_cities = JSON.parse(currentUser.properties.bookmarked_cities.value);
                            if ($scope.bookmarked) {
                                var index = bookmarked_cities.indexOf($scope.city.name);
                                if (index > -1) {
                                    bookmarked_cities.splice(index, 1);
                                }
                            } else {
                                bookmarked_cities.push($scope.city.name);
                            }
                            $scope.bookmarked = !$scope.bookmarked;
                            UserApp.User.save({
                                "user_id": "self",
                                "properties": {
                                    "bookmarked_cities": JSON.stringify(bookmarked_cities),
                                    "override": true
                                }
                            }, function () {
                                // TODO: error handling
                            });
                        }, function () {
                            // TODO: error handling
                        });
                    };
                }, function (err) {
                    // TODO: error handling
                })
            }
        },
        function (error) {
            // TODO: error handling
        }
    );

    Api.getTravelGuidesByCityId($routeParams.id).then(
        function (data) {
            $scope.travelGuides = data;
        },
        function (error) {
            // TODO: error handling
        }
    );

    angular.extend($scope, {
        paths: {}
    });

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