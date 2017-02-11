var fs = require('fs'),
    express = require('express'),
    multer = require('multer'),
    models = require('../models/models'),
    common = require('../service/common'),
    getArticle = require('../service/getArticle'),
    getNav = require('../service/getNav');


var router = express.Router(),
    Nav = models.navs,
    User = models.users,
    Artitle = models.artitles,
    File = models.files,
    pagerFind = common.pagerFind;
var tempPath = './public/temp/',
    uploadPath = './public/upload/';


//largefile大文件上传
var uploadLarge = multer({
    dest: tempPath,
    limits: {}
});
var tempFileList = {};
router.post('/upload/largefile', uploadLarge.single('data'), function (req, res) {
    var name = req.body.name,
        total = req.body.total,
        index = req.body.index,
        size = req.body.size,
        timestamp = req.body.timestamp;

    //重命名临时文件
    var tempFileName = timestamp + '-' + index,
        beforeFile = tempPath + req.file.filename,
        afterFile = tempPath + tempFileName;
    fs.rename(beforeFile, afterFile);

    //返回信息
    res.json({
        success: true,
        message: req.body
    });

    //文件上传临时列表
    var fileRam = 'ram' + timestamp;
    if (tempFileList[fileRam]) {
        tempFileList[fileRam].push(index);
    } else {
        tempFileList[fileRam] = [index];
    }
    console.log(tempFileList);

    //检测当前文件分片是否上传完毕
    if (tempFileList[fileRam].length == total) {
        checkSlice();
    }

    //检测分片文件是否完整
    function checkSlice() {
        var timer = setInterval(function () {
            var count = 0;
            for (var i = 1; i <= total; i++) {
                var checkFile = tempPath + timestamp + '-' + i;
                fs.exists(checkFile, function (exists) {
                    if (exists) {
                        count++;
                        if (count == total) {
                            console.log(count);
                            clearInterval(timer);
                            databaseFileList({
                                url: 'files/upload/' + name,
                                name: name,
                                size: size,
                                time: new Date().Format("yyyy-MM-dd hh:mm:ss")
                            });
                            mergeFile();
                        }
                    } else {
                        count = 0;
                    }
                });
            }
        }, 1000);
    }

    //合并文件
    function mergeFile() {
        var num = 1,
            lastFile = uploadPath + name;
        (function contactFile(num) {
            if (num <= total) {
                var tempFileName = tempPath + timestamp + '-' + num;
                fs.readFile(tempFileName, function (err, data) {
                    if (err) console.log(err.message);
                    fs.appendFile(lastFile, data, function (err) {
                        if (err) console.log(err.message);
                        console.log('success');
                        fs.unlink(tempFileName);
                        num++;
                        contactFile(num);
                    });
                });
            }
        })(num);
    }

});


//formdata普通上传
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({
    storage: storage,
    limits: {}
});
router.post('/upload/formdata', upload.single('file'), function (req, res) {
    var originalName = req.file.originalname;
    databaseFileList({
        url: 'files/upload/' + originalName,
        name: originalName,
        size: req.file.size,
        time: new Date().Format("yyyy-MM-dd hh:mm:ss")
    });
    res.json({
        success: true,
        message: req.file
    });
});


//数据库文件列表
function databaseFileList(fileInfo) {
    File.find({name: fileInfo.name}, function (err, data) {
        if (err) console.log(err.message);
        if (data.length != 0) {
            console.log('The file is exist!');
        } else {
            new File({
                url: fileInfo.url,
                name: fileInfo.name,
                size: fileInfo.size,
                time: fileInfo.time
            }).save();
        }
    });
}

//清除缓存
router.delete('/upload/cleartemps', function (req, res) {
    var temps = fs.readdirSync(tempPath);
    temps.forEach(function (file) {
        fs.unlinkSync(tempPath + file);
    });
    res.json({success: true});
});

//file文件
router.route('/file')
    .get(function (req, res) {

        var condition = req.query.name ? {username: req.query.name} : {};
        pagerFind(req, res, File, {'time': 1}, condition);

    })
    .delete(function (req, res) {
        var name = req.body.name;
        File.remove({name: name}, function (err) {
            if (err) console.log(err.message);
            res.json({success: true});
            fs.unlink(uploadPath + name);
        });
    });


//nav导航
router.route('/nav')
    .get(function (req, res) {
        getNav(req, res);
    })
    .put(function (req, res) {
        var title = req.body.title;
        if (title != '') {
            Nav.find({title: title}, function (err, data) {
                if (err) console.log(err.message);
                if (data.length != 0) {
                    res.json({
                        message: 'The title is exist!'
                    });
                } else {
                    new Nav({
                        title: title
                    }).save();
                    res.send({
                        success: true
                    });
                }
            });
        } else {
            res.json({
                message: 'The title can not empty!'
            });
        }
    })
    .post(function (req, res) {
        var id = req.body.id,
            title = req.body.title;
        Nav.update(
            {id: id},
            {$set: {title: title}},
            {multi: true},
            function (err) {
                if (err) console.log(err.message);
                res.json({success: true});
            }
        );
    })
    .delete(function (req, res) {
        var id = req.body.id;
        Nav.remove({id: id}, function (err) {
            if (err) console.log(err.message);
            res.json({success: true});
        });
    });


//user用户
router.route('/user')
    .get(function (req, res) {

        var condition = req.query.username ? {username: req.query.username} : {};
        pagerFind(req, res, User, {'createusernametime': 1}, condition);

    })
    .put(function (req, res) {
        var username = req.body.username,
            password = req.body.password;
        if (username != '' && password != '') {
            User.find({username: username}, function (err, data) {
                if (err) console.log(err.message);
                if (data.length != 0) {
                    res.json({
                        message: 'The username is exist!'
                    });
                } else {
                    new User({
                        username: username,
                        password: password
                    }).save();
                    res.send({
                        success: true
                    });
                }
            });
        } else {
            res.json({
                message: 'The username or the password can not empty!'
            });
        }
    })
    .post(function (req, res) {
        var id = req.body.id,
            username = req.body.username,
            password = req.body.password;
        User.update(
            {id: id},
            {
                $set: {
                    username: username,
                    password: password
                }
            },
            {multi: true},
            function (err) {
                if (err) console.log(err.message);
                res.json({success: true});
            }
        );
    })
    .delete(function (req, res) {
        var id = req.body.id;
        User.remove({id: id}, function (err) {
            if (err) console.log(err.message);
            res.json({success: true});
        });
    });


//artitle博客
router.route('/artitle')
    .get(function (req, res) {
        getArticle(req, res);
    })
    .put(function (req, res) {
        var title = req.body.title,
            content = req.body.content,
            recommend = req.body.recommend,
            typeid = req.body.typeid,
            typename = req.body.typename;
        if (title != '') {
            Artitle.find({title: title}, function (err, data) {
                if (err) console.log(err.message);
                if (data.length != 0) {
                    res.json({
                        message: 'The title is exist!'
                    });
                } else {
                    var date = new Date().Format("yyyy-MM-dd hh:mm:ss")
                    new Artitle({
                        title: title,
                        typeid: typeid,
                        recommend: recommend,
                        typename: typename,
                        content: content,
                        createtime: date,
                        updatetime: date
                    }).save();
                    res.send({
                        success: true
                    });
                }
            });
        } else {
            res.json({
                message: 'The title can not empty!'
            });
        }
    })
    .post(function (req, res) {
        var id = req.body.id,
            title = req.body.title,
            content = req.body.content,
            recommend = req.body.recommend,
            typeid = req.body.typeid,
            typename = req.body.typename;
        Artitle.update(
            {id: id},
            {
                $set: {
                    title: title,
                    typeid: typeid,
                    recommend: recommend,
                    typename: typename,
                    content: content,
                    updatetime: new Date().Format("yyyy-MM-dd hh:mm:ss")
                }
            },
            {multi: true},
            function (err) {
                if (err) console.log(err.message);
                res.json({success: true});
            }
        );
    })
    .delete(function (req, res) {
        var id = req.body.id;
        Artitle.remove({id: id}, function (err) {
            if (err) console.log(err.message);
            res.json({success: true});
        });
    });


//formatDate
//var time1 = new Date().Format("yyyy-MM-dd");
//var time2 = new Date().Format("yyyy-MM-dd hh:mm:ss");
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

module.exports = router;
