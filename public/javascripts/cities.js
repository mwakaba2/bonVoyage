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

app.controller('CityCtrl', function ($scope, $routeParams, Api, DataVis, leafletData, leafletBoundsHelpers, user, UserApiCache, $compile) {
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
            },
            overlays: {
                bubbles: {
                    name: 'City Bubbles',
                    type: 'group',
                    visible: true
                }
            }
        },
        defaults: {
            scrollWheelZoom: false
        }
    });

    var paths = {};
    var link = '';

    Api.getCityById($routeParams.id).then(
        function (data) {
            $scope.city = data;
            var geocode = $scope.city.geocode;
            var bounds = leafletBoundsHelpers.createBoundsFromArray([
                [geocode[0], geocode[1]],
                [geocode[2], geocode[3]]
            ]);

            $scope.bounds = bounds;
            var things_to_do = $scope.city.attractions_bubble;
            var neighborhood = $scope.city.neighborhood;
            link = $scope.city.attractions_link;
            
            for (var category in things_to_do) {
                var coords = things_to_do[category].geocode
                var value = parseInt(things_to_do[category].value);
                var marker = category.split(' ')[0];
                var randColor = DataVis.getRandHexColor();
                paths[marker] = {
                    type: 'circleMarker',
                    latlngs: {
                        lat: coords.lat,
                        lng: coords.lng
                    },
                    color: randColor,
                    weight: 2,
                    radius: value,
                    fillOpacity: 0.4,
                    layer: "bubbles",
                    label: {
                            message: '<h5 class="text-center"><b>'+category+'</b></h5><h6 class="text-center">'+value+' Things to do</h6>'
                    }
                }
            }

            if ( Object.keys(neighborhood).length > 0) {
                $scope.layers.overlays["neighbors"] = {
                    name: 'Neighborhoods',
                    type: 'group',
                    visible: false
                }
            }
            
            for (var neighbor in neighborhood) {
                var coords = neighborhood[neighbor].geocode
                var northeast = {
                    lat: coords[0],
                    lng: coords[1]
                };
                var southwest = {
                    lat: coords[2],
                    lng: coords[3]
                };
                var northwest = {
                    lat: coords[0],
                    lng: coords[3]
                };
                var southeast = {
                    lat: coords[2],
                    lng: coords[1]
                };
                var value = parseInt(neighborhood[neighbor].value);
                var marker = neighbor.replace(/[-0-9]/g, '');
                var randColor = DataVis.getRandHexColor();
                if(coords.length > 0){
                    paths[marker] = {
                        type: "multiPolyline",
                        latlngs: [
                            [ northwest, northeast ],
                            [ northwest, southwest ],
                            [ northeast, southeast ],
                            [ southeast, southwest]
                        ],
                        color: randColor,
                        weight: 20,
                        opacity: 0.7,
                        layer: "neighbors",
                        message: '<h5 class="text-center"><b>'+neighbor+'</b></h5><h6 class="text-center">'+value+' Things to do</h6>'
                    }
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

            // Show similar cities
            Api.getSimilarCities($scope.city.name).then(
                function (result) {
                    $scope.similar_cities = result;
                },
                function (err) {
                    // TODO
                }
            );
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
        paths: paths
    });


    $scope.$on('leafletDirectivePath.map.click', function(e, path) {
        // Args will contain the marker name and other relevant information
        if(path.leafletObject.options){
            document.getElementById('info').innerHTML = path.leafletObject.options.label.message;
        } else {
            document.getElementById('info').innerHTML = path.leafletObject._popupContent;
        }

        buttonHTML = "<a class='btn btn-info btn-md' href="+link+" target='_blank'>Check it out!</a></div>";
        $('#info').append(buttonHTML);
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