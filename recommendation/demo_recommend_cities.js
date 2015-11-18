var recommend_similar_cities = require('./recommendation').recommend_similar_cities;

var city = 'Berlin';

var monk = require('monk');
var db = monk('localhost:27017/bonVoyage');
db.get('cities').find({}, function (err, cities) {
    if (err) throw err;

    console.log(recommend_similar_cities(cities, city).slice(0, 10));
});