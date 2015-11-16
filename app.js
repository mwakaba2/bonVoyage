var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var monk = require('monk');

var app = express();

// database
var db_url = app.get('env') === 'development' ? 'localhost:27017/bonVoyage' : process.env.MONGOLAB_URI;
var db = monk(db_url);

// livereload
if (app.get('env') === 'developement') {
    var livereload = require('livereload');
    var livereloadServer = livereload.createServer();
    livereloadServer.watch([
        __dirname + "/public",
        __dirname + "/routes",
        __dirname + "/views"
    ]);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

// routes
var routes = require('./routes/index');
var api_cities = require('./routes/api_cities');
var api_travelGuides = require('./routes/api_travelGuides');
var api_recommend = require('./routes/api_recommend');
app.use('/', routes);
app.use('/api/cities', api_cities);
app.use('/api/travelGuides', api_travelGuides);
app.use('/api/recommend', api_recommend);

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
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
