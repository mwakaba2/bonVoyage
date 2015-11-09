var OrderedVector = require('../recommendation/ordered_vector');

module.exports = {
    setUp: function (callback) {
        this.sample_vector = new OrderedVector({
            'sight-seeing': 4,
            'nightlife': 5,
            'museum': 3
        });
        callback();
    },
    testContains: function (test) {
        test.equal(
            this.sample_vector.contains('sight-seeing'),
            true,
            "sample_vector should contain sight-seeing"
        );
        test.equal(
            this.sample_vector.contains('sports'),
            false,
            "sample_vector should not contain sports"
        );
        test.done();
    },
    testPut: function (test) {
        this.sample_vector.put('sports', 3);
        test.equal(
            this.sample_vector.contains('sports'),
            true,
            "sample_vector should contain sports after put sports"
        );
        test.done();
    },
    testFind: function (test) {
        test.equal(
            this.sample_vector.find('nightlife'),
            5,
            "sample_vector should find nightlife as 5"
        );
        test.equal(
            this.sample_vector.find('sports'),
            undefined,
            "sample_vector should find sports as undefined"
        );
        test.done();
    },
    testDotProduct: function (test) {
        var sample_vector_2 = new OrderedVector({
            'sight-seeing': 2,
            'nightlife': 4,
            'museum': 5
        });
        test.deepEqual(
            this.sample_vector.dotProduct(sample_vector_2),
            new OrderedVector({
                'sight-seeing': 8,
                'nightlife': 20,
                'museum': 15
            }),
            'dot product two vectors with same set of keys should return correct result'
        );

        var sample_bad_vector = new OrderedVector({
            'sight-seeing': 4,
            'museum': 3
        });

        var sample_bad_vector_2 = new OrderedVector({
            'sight-seeing': 4,
            'nightlife': 5,
            'museum': 3,
            'sports': 4
        });
        test.done();
    }
};