app.factory("Api", function ($http, $q) {
    return {
        getCities: function () {
            var deferred = $q.defer();

            $http.get('/api/cities').then(
                function (res) {
                    deferred.resolve(res.data);
                },
                function (res) {
                    deferred.reject(res.statusMessage);
                }
            );

            return deferred.promise;
        },
        getCityById: function (id) {

        }
    };
});