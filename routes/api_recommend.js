var express = require('express');
var router = express.Router();
var recommend = require('../recommendation/recommendation');

router.post('/', function (req, res) {
    var bookmarked_cities = req.body.bookmarked;
    var viewed_cities = req.body.viewed;
    req.db.get('cities').find({}, function (err, cities) {
        if (err) throw err;
        res.json(recommend(cities, bookmarked_cities, viewed_cities));
    });
});

module.exports = router;