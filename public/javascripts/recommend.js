app.controller('RecommendCtrl', function ($scope, Api) {
    Api.getRecommendations().then(
        function (data) {
            $scope.welcome = data;
        },
        function (err) {
            // TODO
        }
    );
});