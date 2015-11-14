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

function recommend(cities, bookmarked_cities, viewed_cities) {
    // Build city vectors
    var city_vectors = cities.map(function (city) {
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
    var bookmarked_attractions = collect(cities, bookmarked_cities, types);
    Object.keys(bookmarked_attractions).forEach(function (key) {
        bookmarked_attractions[key] = bookmarked_attractions[key].avg();
    });

    // Collect from viewed cities and compute weighted average
    var viewed_attractions = collect(cities, viewed_cities, types);
    Object.keys(viewed_attractions).forEach(function (key) {
        viewed_attractions[key] = viewed_attractions[key].avg();
    });

    bookmarked_attractions = new SetVector(bookmarked_attractions);
    viewed_attractions = new SetVector(viewed_attractions);

    // Build user vector
    var user_vector = bookmarked_attractions.scalar(viewed_attractions, function (a, b) {
        return 0.8 * a + 0.2 * b;
    });

    // Compute angle between user vector and each city vector
    var angles = city_vectors.map(function (city) {
        var city_vector = city.vector;
        var dot_product = city_vector.dotProduct(user_vector);
        var city_vector_length = city_vector.length();
        var user_vector_length = user_vector.length();
        return {
            name: city.name,
            distance: Math.acos(dot_product / (city_vector_length * user_vector_length))
        }
    });

    // Sort by angles
    angles.sort(function (a, b) {
        return a.distance - b.distance;
    });

    return angles.map(function (angle) {
        return angle.name;
    })
}

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

module.exports = recommend;