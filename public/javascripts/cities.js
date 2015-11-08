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
            
            var minLat = Math.min(geocode[0], geocode[2]);
            var maxLat = Math.max(geocode[0], geocode[2]);
            var minLng = Math.min(geocode[1], geocode[3]);
            var maxLng = Math.max(geocode[1], geocode[3]);

            $scope.bounds = bounds;
            $scope.maxBounds = bounds;
            var things_to_do = $scope.city.attractions_bubble;
            var random_coordinates = [];
            var num_indices = Object.keys(things_to_do).length;

            // Generate random coordinates to display a bubble for each index
            for(var i = 0; i < num_indices; i++){
                random_coordinates.push({
                    lat: parseFloat((Math.random() * (maxLat - minLat) + minLat).toFixed(8)),
                    lng: parseFloat((Math.random() * (maxLng - minLng) + minLng).toFixed(8)),
                });
            } 

            $scope.paths = {};

            for (var category in things_to_do) {
                var coords = random_coordinates.pop();
                var value = parseInt(things_to_do[category]);
                var marker = category.split(' ')[0];
                var link = $scope.city.attractions_link;
                $scope.paths[marker] = {
                    type: 'circleMarker',
                    latlngs: {
                        lat: coords.lat,
                        lng: coords.lng
                    },
                    color: '#'+Math.floor(Math.random()*16777215).toString(16),
                    weight: 2,
                    radius: value,
                    message: '<h5 class="text-center"><b>'+category+'</b></h5><h6>'+value+' Things to do</h6><a target="_blank" href="'+link+'">Check it out!</a>'
                }
            }

            if (user.current.authenticated) {
                user.getCurrent().then(function (currentUser) {
                    // Decide whether the current city is bookmarked
                    var bookmarked_cities = JSON.parse(currentUser.properties.bookmarked_cities.value);
                    $scope.bookmarked = bookmarked_cities.indexOf($scope.city.name) !== -1;

                    // Set up click listener for bookmark button
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

                    // Add current city to viewed cities
                    var viewed_cities = JSON.parse(currentUser.properties.viewed_cities.value);
                    viewed_cities.push($scope.city.name);
                    console.log(viewed_cities);
                    if (viewed_cities.length >= 11) {
                        viewed_cities.pop();
                    }
                    UserApp.User.save({
                        "user_id": "self",
                        "properties": {
                            "viewed_cities": JSON.stringify(viewed_cities),
                            "override": true
                        }
                    }, function () {
                        // TODO: error handling
                    });
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