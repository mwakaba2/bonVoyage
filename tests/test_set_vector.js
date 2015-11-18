var SetVector = require('../recommendation/set_vector');

module.exports = {
    setUp: function (callback) {
        this.sample_vector = new SetVector({
            'sight-seeing': 4,
            'nightlife': 5,
            'museum': 3
        });
        this.sample_vector_2 = new SetVector({
            'sight-seeing': 2,
            'nightlife': 4,
            'museum': 5
        });
        this.sample_vector_3 = new SetVector({
            'sight-seeing': 2,
            'museum': 5,
            'nightlife': 4
        });
        this.simple_vector = new SetVector({
            a: 1,
            b: 2,
            c: 3
        });
        this.simple_vector_2 = new SetVector({
            a: 2,
            b: 3,
            c: 4
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
    testCheckIdentity: function (test) {
        var sample_bad_vector = new SetVector({
            'sight-seeing': 4,
            'museum': 3
        });
        test.throws(function () {
            this.sample_vector.scalarProduct(sample_bad_vector)
        }, Error, 'check identity of two vectors with different set of keys should throw');

        var sample_bad_vector_2 = new SetVector({
            'sight-seeing': 4,
            'nightlife': 5,
            'museum': 3,
            'sports': 4
        });
        test.throws(function () {
            this.sample_vector.scalarProduct(sample_bad_vector_2)
        }, Error, 'check identity of two vectors with different set of keys should throw');

        test.done();
    },
    testScalarProduct: function (test) {
        test.deepEqual(
            this.sample_vector.scalarProduct(this.sample_vector_2),
            new SetVector({
                'sight-seeing': 8,
                'nightlife': 20,
                'museum': 15
            }),
            'scalar product two vectors should return correct result'
        );
        test.done();
    },
    testDotProduct: function (test) {
        test.equal(
            this.simple_vector.dotProduct(this.simple_vector_2),
            1 * 2 + 2 * 3 + 3 * 4,
            'dot product should return the correct result'
        );
        test.done();
    },
    testLength: function (test) {
        test.equal(
            this.simple_vector.length(),
            Math.sqrt(1 + 4 + 9),
            'length should return the correct result'
        );
        test.done();
    },
    testAngleInRadian: function (test) {
        test.equal(
            this.sample_vector.angleInRadian(this.sample_vector_2),
            Math.acos(this.sample_vector.dotProduct(this.sample_vector_2) / (this.sample_vector.length() * this.sample_vector_2.length())),
            'radian angle two vectors should return correct result'
        );
        test.done();
    }
};