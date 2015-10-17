app.controller('TravelGuideCtrl', function ($scope, $resource, $routeParams, $location, user, UserApp, Api) {
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

app.controller('AddTravelGuideCtrl', function ($scope, $resource, $routeParams, $location, user, Api) {
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
            var travelGuideQuery = $resource('/api/travelGuides');
            $scope.travel_guide.city_id = $scope.city_id;
            $scope.travel_guide.user_id = $scope.user_id;
            travelGuideQuery.save($scope.travel_guide, function (response) {
                $location.path('/travelGuide/' + response._id);
            });
        }
    };
});


app.controller('EditTravelGuideCtrl', function ($scope, $resource, $location, $routeParams, Api) {
    var TravelGuides = $resource('/api/travelGuides/:id', {id: '@_id'}, {
        update: {method: 'PUT'}
    });
    TravelGuides.get({id: $routeParams.id}, function (travelGuide) {
        $scope.travelGuide = travelGuide;

        Api.getCityById($scope.travelGuide.city_id).then(
            function (data) {
                $scope.city = data;
            },
            function () {
                // TODO: error handling
            }
        );

        $scope.save = function () {
            TravelGuides.update($scope.travelGuide, function () {
                $location.path('/travelGuide/' + $routeParams.id);
            });

        }
    });
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