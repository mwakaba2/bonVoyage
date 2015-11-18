var SetVector = function (object) {
    this.keys = [];
    this.values = [];

    if (object !== undefined) {
        var context = this;
        Object.keys(object).forEach(function (key) {
            context.keys.push(key);
            context.values.push(object[key]);
        });
    }
};

SetVector.prototype.contains = function (key) {
    return this.keys.indexOf(key) !== -1;
};

SetVector.prototype.put = function (key, value) {
    if (!this.contains(key)) {
        this.keys.push(key);
        this.values.push(value);
    }
};

SetVector.prototype.find = function (key) {
    var indexOfKey = this.keys.indexOf(key);
    if (indexOfKey !== -1) {
        return this.values[indexOfKey];
    } else {
        return undefined;
    }
};

SetVector.prototype.checkIdentity = function (that) {
    if (this.keys.length !== that.keys.length) {
        return false;
    }

    var this_keys_sorted = this.keys.clone().sort();
    var that_keys_sorted = that.keys.clone().sort();
    for (var i = 0 ; i < this_keys_sorted.length ; ++i) {
        if (this_keys_sorted[i] !== that_keys_sorted[i]) {
            return false;
        }
    }

    return true;
};

SetVector.prototype.scalarProduct = function (that) {
    return this.scalar(that, function (a, b) {
        return a * b;
    })
};

Array.prototype.clone = function() {
    return this.slice(0);
};

SetVector.prototype.scalar = function (that, op) {
    if (!this.checkIdentity(that)) {
        throw new Error(that + " should have the same key set with " + this);
    }

    var result = new SetVector();
    for (var j = 0 ; j < this.keys.length ; ++j) {
        var key = this.keys[j];
        var this_value = this.find(key);
        var that_value = that.find(key);
        result.put(key, op(this_value, that_value));
    }
    return result;
};

SetVector.prototype.dotProduct = function (that) {
    var scalarProduct = this.scalarProduct(that);
    return scalarProduct.values.reduce(function (a, b) {
        return a + b;
    })
};

SetVector.prototype.length = function () {
    var squared_sum = 0;
    this.values.forEach(function (value) {
        squared_sum += value * value;
    });
    return Math.sqrt(squared_sum);
};

SetVector.prototype.angleInRadian = function (that) {
    if (!this.checkIdentity(that)) {
        throw new Error(that + " should have the same key set with " + this);
    }

    return Math.acos(this.dotProduct(that) / (this.length() * that.length()));
};

module.exports = SetVector;