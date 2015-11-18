app.controller('RecommendCtrl', function ($scope, Api) {
    Api.getRecommendations().then(
        function (data) {
            $scope.cities = data;
        },
        function (err) {
            // TODO
        }
    );
});