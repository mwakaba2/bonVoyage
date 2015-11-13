var recommend = require('./recommendation');

var bookmarked_cities = ['Paris', 'Berlin'];
var viewed_cities = [];

var monk = require('monk');
var db = monk('localhost:27017/bonVoyage');
db.get('cities').find({}, function (err, cities) {
    if (err) throw err;

    console.log(recommend(cities, bookmarked_cities, viewed_cities).slice(0, 10));
});