app.controller('TravelGuideCtrl', function ($scope, $resource, $routeParams) {
    var travelGuideQuery = $resource(
        '/api/travelGuides/:id',
        {id: $routeParams.id},
        {query: {isArray: false}}
    );
    travelGuideQuery.query(function (result) {
        $scope.travelGuide = result;
        var cityQuery = $resource(
            '/api/cities/:id',
            {id: $scope.travelGuide.city_id},
            {query: {isArray: false}}
        );
        cityQuery.query(function (result) {
            $scope.city = result;
        });
        UserApp.User.get({
            "user_id": $scope.travelGuide.user_id
        }, function (error, result) {
            $scope.user = result;
        });
    });

});

app.controller('AddTravelGuideCtrl', function ($scope, $resource, $routeParams, $location, user) {
    // Get parameters
    $scope.city_id = $routeParams.city_id;
    $scope.user_id = user.current.user_id;

    // Fill in city
    var cityQuery = $resource(
        '/api/cities/:id',
        {id: $scope.city_id},
        {query: {isArray: false}}
    );
    cityQuery.query(function (result) {
        $scope.city = result;
    });

    $scope.travel_guide = {};
    $scope.save = function () {
        var travelGuideQuery = $resource('/api/travelGuides');
        $scope.travel_guide.city_id = $scope.city_id;
        $scope.travel_guide.user_id = $scope.user_id;
        travelGuideQuery.save($scope.travel_guide, function(response) {
            $location.path('/travelGuide/' + response.id);
        });
    };
});
