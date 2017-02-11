var common = require('../service/common'),
    models = require('../models/models');

var pagerFind = common.pagerFind,
    Artitle = models.artitles;

module.exports = function getArticle(req, res){

    var obj = {};
    if (req.query.id) {
        obj = {id: req.query.id}
    } else if (req.query.typeid) {
        obj = {typeid: req.query.typeid}
    }  else if (req.query.recommend) {
        obj = {recommend: req.query.recommend}
    } else {
        obj = {};
    }

    pagerFind(req, res, Artitle, {'updatetime': -1}, obj);

}