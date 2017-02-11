//findAndModify
exports.findAndModify = function (schema) {
    return schema.statics.findAndModify = function (query, sort, doc, options, callback) {
        return this.collection.findAndModify(query, sort, doc, options, callback);
    };
};

//increment
exports.increment = function (schema) {
    return schema.statics.increment = function (counter, callback) {
        return this.collection.findAndModify({ _id: counter }, [], { $inc: { next: 1 } }, callback);
    };
};