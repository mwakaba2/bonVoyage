app.controller('TravelGuideCtrl', function ($scope, $routeParams, $location, user, UserApp, Api) {
    Api.getTravelGuideById($routeParams.id).then(
        function (data) {
            $scope.travelGuide = data;

            var created_at = $scope.travelGuide.created_at;
            created_at = moment(new Date(created_at)).format('MMMM Do YYYY, h:mm:ss a');
            $scope.travelGuide.created_at = created_at;

            var updated_at = $scope.travelGuide.updated_at;
            updated_at = moment(new Date(updated_at)).format('MMMM Do YYYY, h:mm:ss a');
            $scope.travelGuide.updated_at = updated_at;
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
        var result = confirm("Are you sure you would like to delete "+$scope.travelGuide.title+"?");
        if (result) {
            Api.deleteTravelGuideById($routeParams.id).then(
                function (data) {
                    $location.path('/');
                },
                function (error) {
                    // TODO: error handling
                }
            );
        }
    }
});

app.controller('AddTravelGuideCtrl', function ($scope, $routeParams, $location, user, Api, categories) {
    // Category choices
    $scope.categories = categories;

    Api.getCityById($routeParams.city_id).then(
        function (data) {
            $scope.city = data;
        },
        function () {
            // TODO: error handling
        }
    );

    $scope.alert = false;

    $scope.travel_guide = {};
    $scope.travel_guide.city_id = $routeParams.city_id;
    $scope.travel_guide.user_id = user.current.user_id;

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
            Api.createTravelGuide($scope.travel_guide).then(
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
                Api.updateTravelGuideById($routeParams.id, $scope.travelGuide).then(
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


app.filter('activeTravelGuides', function () {
    Array.prototype.contains = function (item) {
        return this.indexOf(item) !== -1;
    };

    Array.prototype.removeFirst = function (item) {
        var index = this.indexOf(item);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    String.prototype.contains = function (needle) {
        return needle === '' || this.indexOf(needle) !== -1;
    };
    return function (items, active_categories, active_name) {
        return items.filter(function (item) {
            return active_categories.contains(item.category)
                && item.city.name.toUpperCase().contains(active_name.toUpperCase());
        })
    }
});

app.controller('TravelGuidesCtrl', function ($scope, $parse, Api, categories) {
    Array.prototype.contains = function (item) {
        return this.indexOf(item) !== -1;
    };

    Array.prototype.removeFirst = function (item) {
        var index = this.indexOf(item);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    String.prototype.contains = function (needle) {
        return needle === '' || this.indexOf(needle) !== -1;
    };
    
    Api.getTravelGuides().then(
        function (data) {
            $scope.travelGuides = data;

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
        },
        function (error) {
            // TODO: error handling
        }
    );

    $scope.categories = categories;
    $scope.active_categories = categories.map(function (category) {
        return category.value;
    });
    $scope.categoryClicked = function (value) {
        if ($scope.active_categories.contains(value)) {
            $scope.active_categories.removeFirst(value);
        } else {
            $scope.active_categories.push(value);
        }
    };

    $scope.active_name = "";
});