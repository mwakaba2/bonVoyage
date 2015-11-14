app.factory('UserApiCache', function ($q, user, UserApp) {
    var bookmarked_cities = undefined;
    var viewed_cities = undefined;
    return {
        init: function () {
            var deferred = $q.defer();

            if (bookmarked_cities === undefined || viewed_cities === undefined) {
                user.getCurrent().then(function (result, err) {
                    if (err) {
                        deferred.reject(err)
                    } else {
                        bookmarked_cities = JSON.parse(result.properties.bookmarked_cities.value);
                        viewed_cities = JSON.parse(result.properties.viewed_cities.value);
                        deferred.resolve();
                    }
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        },
        getBookmarks: function () {
            var deferred = $q.defer();

            this.init().then(
                function () {
                    deferred.resolve(bookmarked_cities);
                },
                function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;
        },
        toggleBookmark: function (city) {
            var deferred = $q.defer();

            this.init().then(
                function () {
                    if (bookmarked_cities.indexOf(city) === -1) {
                        bookmarked_cities.push(city);
                    } else {
                        var index = bookmarked_cities.indexOf(city);
                        if (index > -1) {
                            bookmarked_cities.splice(index, 1);
                        }
                    }
                    UserApp.User.save({
                        "user_id": "self",
                        "properties": {
                            "bookmarked_cities": JSON.stringify(bookmarked_cities),
                            "override": true
                        }
                    }, function (result, err) {
                        deferred.resolve()
                    });
                },
                function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;
        },
        addToViewed: function (city) {
            var deferred = $q.defer();

            this.init().then(
                function () {
                    viewed_cities.push(city);
                    if (viewed_cities.length >= 11) {
                        viewed_cities.shift();
                    }
                    UserApp.User.save({
                        "user_id": "self",
                        "properties": {
                            "viewed_cities": JSON.stringify(viewed_cities),
                            "override": true
                        }
                    }, function (result, err) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve();
                        }
                    });
                },
                function (err) {
                    deferred.reject(err);
                }
            );

            return deferred.promise;
        }
    }
});