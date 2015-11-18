var express = require('express');
var router = express.Router();
var recommend = require('../recommendation/recommendation').recommend;
var recommend_similar_cities = require('../recommendation/recommendation').recommend_similar_cities;

router.post('/', function (req, res) {
    var bookmarked_cities = req.body.bookmarked;
    var viewed_cities = req.body.viewed;
    var limit = req.body.limit;
    req.db.get('cities').find({}, function (err, cities) {
        if (err) throw err;
        res.json(recommend(cities, bookmarked_cities, viewed_cities).slice(0, limit));
    });
});

router.post('/city/', function (req, res) {
    var city = req.body.city;
    var limit = req.body.limit;
    req.db.get('cities').find({}, function (err, cities) {
        if (err) throw err;
        res.json(recommend_similar_cities(cities, city).slice(0, limit));
    })
});

module.exports = router;