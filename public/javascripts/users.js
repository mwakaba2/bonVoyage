app.controller('UserCtrl', function ($scope, $routeParams, $location, user, Api) {
    user.getCurrent().then(function (currentUser) {
        $scope.currentUser = currentUser;
    }).then(
        function () {
            return Api.getTravelGuidesByUserId($scope.currentUser.user_id);
        },
        function (err) {
            // TODO: error handling here
        }
    ).then(
        function (travel_guides_by_user) {
            $scope.travelGuides = travel_guides_by_user;
            $scope.bookmarked_cities = JSON.parse($scope.currentUser.properties.bookmarked_cities.value);
            $scope.bookmarked_cities = $scope.bookmarked_cities.map(function (city_name) {
                return {
                    name: city_name,
                    _id: ""
                }
            });

            angular.forEach($scope.travelGuides, function (travelGuide, index) {
                Api.getCityById(travelGuide.city_id).then(
                    function (data) {
                        $scope.travelGuides[index].city = data;
                    },
                    function () {
                        // TODO: error handling
                    }
                );
            });

            angular.forEach($scope.bookmarked_cities, function (city, index) {
                Api.getCityIdByName(city.name).then(
                    function (data) {
                        $scope.bookmarked_cities[index]._id = data;
                    },
                    function () {
                        // TODO: error handling
                    }
                )
            })
        },
        function (err) {
            // TODO: error handling here
        }
    );

});

app.controller('EditUserCtrl', function ($scope, $routeParams, $location, user, UserApp) {
    user.getCurrent().then(function (currentUser) {
        $scope.currentUser = currentUser;
    });
    $scope.save = function () {
        UserApp.User.save({
            "user_id": "self",
            "properties": {
                "about_me": {
                    "value": $scope.currentUser.properties['about_me'].value,
                    "override": true
                }
            }
        }, function (error, result) {
            // TODO: Handle error/result
        });
        $location.path('/user');
    }
});
