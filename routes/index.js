var express = require('express'),
    getArticle = require('../service/getArticle'),
    getNav = require('../service/getNav');

var router = express.Router();


router.get('/article', function (req, res) {
    getArticle(req, res);
});

router.get('/nav', function (req, res) {
    getNav(req, res);
});

module.exports = router;
