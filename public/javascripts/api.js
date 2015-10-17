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
            var deferred = $q.defer();

            $http.get('/api/cities/' + id).then(
                function (res) {
                    deferred.resolve(res.data);
                },
                function (res) {
                    deferred.reject(res.statusMessage);
                }
            );

            return deferred.promise;
        },
        postTravelGuide: function (new_travel_guide) {
            var deferred = $q.defer();

            $http.post('/api/travelGuides', new_travel_guide).then(
                function (res) {
                    deferred.resolve(res.data);
                },
                function (res) {
                    deferred.reject(res.statusMessage);
                }
            );

            return deferred.promise;
        },
        getTravelGuides: function () {
            var deferred = $q.defer();

            $http.get('/api/travelGuides').then(
                function (res) {
                    deferred.resolve(res.data);
                },
                function (res) {
                    deferred.reject(res.statusMessage);
                }
            );

            return deferred.promise;
        },
        getTravelGuideById: function (id) {
            var deferred = $q.defer();

            $http.get('/api/travelGuides/' + id).then(
                function (res) {
                    deferred.resolve(res.data);
                },
                function (res) {
                    deferred.reject(res.statusMessage);
                }
            );

            return deferred.promise;
        },
        putTravelGuideById: function (id, new_travel_guide) {
            var deferred = $q.defer();

            $http.put('/api/travelGuides/' + id, new_travel_guide).then(
                function (res) {
                    deferred.resolve(res.data);
                },
                function (res) {
                    deferred.reject(res.statusMessage);
                }
            );

            return deferred.promise;
        },
        deleteTravelGuideById: function (id) {
            var deferred = $q.defer();

            $http.delete('/api/travelGuides/' + id).then(
                function (res) {
                    deferred.resolve(res.data);
                },
                function (res) {
                    deferred.reject(res.statusMessage);
                }
            );

            return deferred.promise;
        },
        getTravelGuidesByCityId: function (city_id) {
            var deferred = $q.defer();

            $http.get('/api/cities/' + city_id + '/travelGuides').then(
                function (res) {
                    deferred.resolve(res.data);
                },
                function (res) {
                    deferred.reject(res.statusMessage);
                }
            );

            return deferred.promise;
        }
    };
});