var express = require('Express');
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
        res.json({
            id: travelGuide._id
        });
    });
});

router.get('/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('travelGuides');
    collection.findOne({ _id: req.params.id }, function(err, city){
        if (err) throw err;

        res.json(city);
    });
});

module.exports = router;