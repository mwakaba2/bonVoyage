var SetVector = require('./set_vector');

Array.prototype.avg = function () {
    this.forEach(function (item) {
        if (typeof item !== 'number') {
            return 0;
        }
    });
    if (this.length == 0) {
        return 0;
    }
    var sum = this.reduce(function(a, b) {
        return a + b;
    });
    return sum / this.length;
};

exports.recommend = function(cities, bookmarked_cities, viewed_cities) {
    // Build city profiles
    var city_profiles = cities.map(function (city) {
        return {
            name: city.name,
            vector: new SetVector(city.attractions)
        }
    });

    // Collect types of collections
    var types = [];
    cities.forEach(function (city) {
        Object.keys(city.attractions).forEach(function (type) {
            if (!types.contains(type)) {
                types.push(type);
            }
        })
    });

    // Collect from bookmarked cities and compute weighted average
    var attractions_for_bookmarked_cities = collect(cities, bookmarked_cities, types);
    Object.keys(attractions_for_bookmarked_cities).forEach(function (key) {
        attractions_for_bookmarked_cities[key] = attractions_for_bookmarked_cities[key].avg();
    });

    // Collect from viewed cities and compute weighted average
    var attractions_for_viewed_cities = collect(cities, viewed_cities, types);
    Object.keys(attractions_for_viewed_cities).forEach(function (key) {
        attractions_for_viewed_cities[key] = attractions_for_viewed_cities[key].avg();
    });

    attractions_for_bookmarked_cities = new SetVector(attractions_for_bookmarked_cities);
    attractions_for_viewed_cities = new SetVector(attractions_for_viewed_cities);

    // Build user profile
    var user_profile = attractions_for_bookmarked_cities.scalar(attractions_for_viewed_cities, function (a, b) {
        return 0.8 * a + 0.2 * b;
    });

    // Compute angle between user vector and each city vector
    var angles = city_profiles.map(function (city_profile) {
        return {
            name: city_profile.name,
            distance: city_profile.vector.angleInRadian(user_profile)
        }
    });

    // Sort by angles
    angles.sort(function (a, b) {
        return a.distance - b.distance;
    });

    return angles.map(function (angle) {
        return angle.name;
    })
};

Array.prototype.contains = function (item) {
    return this.indexOf(item) !== -1;
};

function collect(cities, city_names, types) {
    var result = {};
    types.forEach(function (type) {
        result[type] = [];
    });

    // For each city
    cities.forEach(function (city) {
        // If city matches
        if (city_names.contains(city.name)) {
            // For each attraction type
            Object.keys(city.attractions).forEach(function (type) {
                result[type].push(city.attractions[type]);
            })
        }
    });

    return result;
}

exports.recommend_similar_cities = function(cities, city) {
    // Build city profiles
    var city_profiles = cities.map(function (city) {
        return {
            name: city.name,
            vector: new SetVector(city.attractions)
        }
    });

    // Find target city vector
    var target_city_vector = undefined;
    city_profiles.forEach(function (city_profile) {
        if (city_profile.name === city) {
            target_city_vector = city_profile.vector;
        }
    });

    if (target_city_vector === undefined) {
        return [];
    }

    // Compute angle between target city vector and each city vector
    var angles = city_profiles.map(function (city_profile) {
        return {
            name: city_profile.name,
            distance: city_profile.vector.angleInRadian(target_city_vector)
        }
    });

    // Sort by angles
    angles.sort(function (a, b) {
        return a.distance - b.distance;
    });
    
    return angles
        .filter(function (angle) {
            return angle.name !== city;
        })
        .map(function (angle) {
            return angle.name;
        });
};