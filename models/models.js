var mongoose = require('mongoose'),
    autoIncrement = require("mongoose-auto-increment");

var connection = mongoose.connect('mongodb://localhost/blogdb', function (err) {
    if (err) {
        console.log(err.message);
    } else {
        console.log('success');
    }
});
autoIncrement.initialize(connection);


//navs
var navsSchema = new mongoose.Schema({
    id: {type: Number},
    title: {type: String}
});
navsSchema.plugin(autoIncrement.plugin, {
    model: 'Nav',
    field: 'id'
});
mongoose.model('Nav', navsSchema);
exports.navs = mongoose.model('Nav');


//users
var usersSchema = new mongoose.Schema({
    id: {type: Number},
    username: {type: String},
    password: {type: String}
});
usersSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id'
});
mongoose.model('User', usersSchema);
exports.users = mongoose.model('User');


//artitles
var artitlesSchema = new mongoose.Schema({
    id: {type: Number},
    typeid: {type: Number},
    recommend: {type: Number},
    typename: {type: String},
    title: {type: String},
    content: {type: String},
    createtime: {type: String},
    updatetime: {type: String}
});
artitlesSchema.plugin(autoIncrement.plugin, {
    model: 'Artitle',
    field: 'id'
});
mongoose.model('Artitle', artitlesSchema);
exports.artitles = mongoose.model('Artitle');


//files
var filesSchema = new mongoose.Schema({
    url: {type: String},
    name: {type: String},
    size: {type: Number},
    time: {type: String}
});
filesSchema.plugin(autoIncrement.plugin, {
    model: 'File',
    field: 'id'
});
mongoose.model('File', filesSchema);
exports.files = mongoose.model('File');