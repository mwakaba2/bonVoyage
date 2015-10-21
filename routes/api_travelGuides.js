var express = require('express');
var router = express.Router();


router.post('/', function (req, res) {
    var db = req.db;
    var collection = db.get('travelGuides');
    collection.insert({
        city_id: req.body.city_id,
        user_id: req.body.user_id,
        title: req.body.title,
        category: req.body.category,
        content: req.body.content,
        created_at: new Date(),
        updated_at: new Date()
    }, function (err, travelGuide) {
        if (err) throw err;
        res.json(travelGuide);
    });
});

router.get('/', function (req, res) {
    var db = req.db;
    var collection = db.get('travelGuides');
    collection.find({}, function (err, travelGuides) {
        if (err) throw err;
        res.json(travelGuides);
    });
});

router.get('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('travelGuides');
    collection.findOne({_id: req.params.id}, function (err, city) {
        if (err) throw err;

        res.json(city);
    });
});

router.put('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('travelGuides');
    collection.update({
            _id: req.params.id
        },
        {
            $set: {
                content: req.body.content,
                updated_at: new Date()
            }

        }, function (err, travelGuide) {
            if (err) throw err;

            res.json(travelGuide);
        });
});

router.delete('/:id', function (req, res) {
    var db = req.db;
    var collection = db.get('travelGuides');
    collection.remove({
        _id: req.params.id
    }, function (err, result) {
        if (err) throw err;

        res.json(result);
    });
});

router.get('/user/:user_id', function (req, res) {
    var collection = req.db.get('travelGuides');
    collection.find({'user_id': req.params.user_id}, function (err, travel_guides) {
        if (err) throw err;

        res.json(travel_guides);
    });
});

module.exports = router;