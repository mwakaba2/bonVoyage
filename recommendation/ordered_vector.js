var OrderedVector = function (object) {
    this.keys = [];
    this.values = [];

    if (object !== undefined) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                this.keys.push(key);
                this.values.push(object[key]);
            }
        }
    }
};

OrderedVector.prototype.put = function (key, value) {
    this.keys.push(key);
    this.values.push(value);
};

OrderedVector.prototype.contains = function (key) {
    return this.keys.indexOf(key) !== -1;
};

OrderedVector.prototype.find = function (key) {
    var indexOfKey = this.keys.indexOf(key);
    if (indexOfKey !== -1) {
        return this.values[indexOfKey];
    } else {
        return undefined;
    }
};

OrderedVector.prototype.dotProduct = function (that) {
    var result = new OrderedVector();
    for (var i = 0 ; i < this.keys.length ; ++i) {
        var thisKey = this.keys[i];
        if (!that.contains(thisKey)) {
            throw new Error(that + " does not have key " + thisKey);
        } else {
            var thisValue = this.find(thisKey);
            var thatValue = that.find(thisKey);
            result.put(thisKey, thisValue * thatValue);
        }
    }
    return result;
};
