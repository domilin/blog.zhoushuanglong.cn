var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session');

var login = require('./routes/login'),
    blog = require('./routes/blog'),
    index = require('./routes/index'),
    filter = require('./service/filter');

var app = express();


//addMySelf:nodemon
var debug = require('debug')('app'); // debug模块
app.set('port', process.env.PORT || 80); // 设定监听端口

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(cookieParser());
app.use(expressSession({
    name: 'username',
    secret: 'myblog',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'views')));
app.use('/files', express.static(path.join(__dirname, 'public')));

app.use('/login', login);
app.use('/management', filter, blog);
app.use('/index', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        console.log(err.message);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
});


module.exports = app;

//addMySelf:nodemon
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
