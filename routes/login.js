var express = require('express'),
    crypto = require('crypto'),
    models = require('../models/models');

var router = express.Router(),
    md5 = crypto.createHash('md5'),
    User = models.users;


router.get('/', function (req, res) {
    var query = req.query,
        username = query.username,
        password = query.password;
        //md5Username = md5.update(username).digest('hex');

    User.find({username: username}, function (err, data) {
        if (err) console.log(err.message);
        if (data.length == 0) {
            res.json({'success': false});//no user
        } else {
            if (data[0].password == password) {
                req.session.username = username;
                res.json({'success': true});
            } else {
                res.json({'success': false});//wrong password
            }
        }
    });
});

module.exports = router;
