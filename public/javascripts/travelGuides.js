app.controller('TravelGuideCtrl', function ($scope, $routeParams, $location, user, UserApp, Api) {
    Api.getTravelGuideById($routeParams.id).then(
        function (data) {
            $scope.travelGuide = data;
        },
        function (error) {
            // TODO: error handling
        }
    ).then(
        function () {
            return Api.getCityById($scope.travelGuide.city_id);
        },
        function (error) {
            // TODO: error handling
        }
    ).then(
        function (data) {
            $scope.city = data;
        },
        function (error) {
            // TODO: error handling
        }
    ).then(
        function () {
            UserApp.User.get({
                "user_id": $scope.travelGuide.user_id
            }, function (err, result) {
                $scope.author = result[0];
                $scope.isAuthor = $scope.author.user_id === user.current.user_id;
                $scope.$apply();
            });
        },
        function (error) {
            // TODO: error handling
        }
    );

    $scope.delete = function () {
        Api.deleteTravelGuideById($routeParams.id).then(
            function (data) {
                $location.path('/');
            },
            function (error) {
                // TODO: error handling
            }
        );
    }
});

app.controller('AddTravelGuideCtrl', function ($scope, $routeParams, $location, user, Api) {
    // Category choices
    $scope.categories = [
        {'name': 'Gastronomy', 'value': 'gastronomy'},
        {'name': 'Entertainment', 'value': 'entertainment'},
        {'name': 'Nature', 'value': 'entertainment'},
        {'name': 'Weather', 'value': 'weather'},
        {'name': 'Shopping', 'value': 'shopping'},
        {'name': 'Etiquette', 'value': 'etiquette'},
        {'name': 'Sight-Seeing', 'value': 'sight-seeing'}
    ];
    // Get parameters
    $scope.city_id = $routeParams.city_id;
    $scope.user_id = user.current.user_id;

    Api.getCityById($scope.city_id).then(
        function (data) {
            $scope.city = data;
        },
        function () {
            // TODO: error handling
        }
    );

    $scope.travel_guide = {};
    $scope.alert = false;

    $scope.save = function () {
        if ($scope.travel_guide.title === undefined) {
            $scope.alert = "Title cannot be empty";
        } else if ($scope.travel_guide.content === undefined) {
            $scope.alert = "Content cannot be empty";
        } else if ($scope.travel_guide.content.split(" ").length < 21) {
            $scope.alert = "Content cannot be shorter than 20 words";
        } else if ($scope.travel_guide.category === undefined) {
            $scope.travel_guide.category = "other";
        } else {
            Api.postTravelGuide($scope.travel_guide).then(
                function (data) {
                    $location.path('/travelGuide/' + data._id);
                },
                function (error) {
                    // TODO: error handling
                }
            );
        }
    };
});


app.controller('EditTravelGuideCtrl', function ($scope, $location, $routeParams, Api) {
    Api.getTravelGuideById($routeParams.id).then(
        function (data) {
            $scope.travelGuide = data;
        },
        function (error) {
            // TODO: error handling
        }
    ).then(
        function () {
            return Api.getCityById($scope.travelGuide.city_id);
        },
        function (error) {
            // TODO: error handling
        }
    ).then(
        function (data) {
            $scope.city = data;
        },
        function (error) {
            // TODO: error handling
        }
    ).then(
        function () {
            $scope.save = function () {
                Api.putTravelGuideById($routeParams.id, $scope.travelGuide).then(
                    function () {
                        $location.path('/travelGuide/' + $routeParams.id);
                    },
                    function (error) {
                        // TODO: error handling
                    }
                );
            }
        },
        function (error) {
            // TODO: error handling
        }
    );
});

app.controller('TravelGuidesCtrl', function ($scope, Api) {
    Api.getTravelGuides().then(
        function (data) {
            $scope.travelGuides = data;
        },
        function (error) {
            // TODO: error handling
        }
    );
});