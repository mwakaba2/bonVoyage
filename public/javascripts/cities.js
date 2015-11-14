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

app.controller('CityCtrl', function ($scope, $routeParams, Api, DataVis, leafletData, leafletBoundsHelpers, user, UserApiCache) {
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

            $scope.bounds = bounds;
            $scope.maxBounds = bounds;
            var things_to_do = $scope.city.attractions_bubble;
            $scope.paths = {};

            for (var category in things_to_do) {
                var coords = things_to_do[category].geocode
                var value = parseInt(things_to_do[category].value);
                var marker = category.split(' ')[0];
                var link = $scope.city.attractions_link;
                var randColor = DataVis.getRandHexColor();
                $scope.paths[marker] = {
                    type: 'circleMarker',
                    latlngs: {
                        lat: coords.lat,
                        lng: coords.lng
                    },
                    color: randColor,
                    weight: 2,
                    radius: value,
                    fillOpacity: 0.4,
                    message: '<h5 class="text-center"><b>'+category+'</b></h5><h6>'+value+' Things to do</h6><a target = "_blank" href="'+link+'">Check it out!</a>'
                }
            }

            // If user is authenticated, do something with bookmarked and viewed cities
            if (user.current.authenticated) {

                // Add to viewed cities
                UserApiCache.addToViewed($scope.city.name).then(
                    function () {},
                    function (err) {
                        // TODO: error handling
                    }
                );

                // Whether the city is bookmarked?
                UserApiCache.getBookmarks().then(
                    function (result) {
                        $scope.bookmarked = result.indexOf($scope.city.name) !== -1;
                    },
                    function (err) {
                        // TODO: error handling
                    }
                );

                // Toggle bookmark
                $scope.toggleBookmark = function () {
                    UserApiCache.toggleBookmark($scope.city.name).then(
                        function () {
                            $scope.bookmarked = !$scope.bookmarked;
                        },
                        function (err) {
                            // TODO: error handling
                        }
                    );
                }
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