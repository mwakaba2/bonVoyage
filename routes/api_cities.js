var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('cities');
    collection.find({}, function(err,cities){
        if (err) throw err;
      	res.json(cities);
    });
});

//router.post('/', function(req, res){
//    var db = req.db;
//    var collection = db.get('cities');
//    collection.insert({
//        name: req.body.name,
//        country: req.body.country
//    }, function(err, city){
//        if (err) throw err;
//
//        res.json(city);
//    });
//});


router.get('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('cities');
    collection.findOne({ _id: req.params.id }, function(err, city){
        if (err) throw err;

      	res.json(city);
    });
});

//router.put('/:id', function(req, res){
//    var db = req.db;
//    var collection = db.get('cities');
//    collection.update({
//        _id: req.params.id
//    },
//    {
//        name: req.body.name,
//        country: req.body.country
//    }, function(err, city){
//        if (err) throw err;
//
//        res.json(city);
//    });
//});
//
//
//router.delete('/:id', function(req, res) {
//    var db = req.db;
//    var collection = db.get('cities');
//    collection.remove({ _id: req.params.id }, function(err, city){
//        if (err) throw err;
//
//      	res.json(city);
//    });
//});


module.exports = router;