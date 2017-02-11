var models = require('../models/models');

var Nav = models.navs;

module.exports = function getNav(req, res){

    Nav.find(function (err, data) {
        if (err) console.log(err.message);
        res.json(data);
    });

};