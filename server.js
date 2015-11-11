var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');
var session = require('express-session');

var routes = require('./server/api/index');
var login = require('./server/api/login');

var app = express();

/*
 Database and Models
 */
mongoose.connect("mongodb://localhost/mongodb");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    salt: String,
    hash: String,
    admin: Boolean
});
var User = mongoose.model('users', UserSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('Authentication Model'));
app.use(session({secret: 'keyboard mc190', cookie: {maxAge: 60000},user:''}));
app.use(express.static(path.join(__dirname, './client', 'public')));
app.use(express.static(path.join(__dirname, './client', 'views')));
app.use(favicon(path.join(__dirname, './client', 'public', 'images', 'favicon.ico')));

app.use('/', routes);
app.use('/loginuser', login);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = req.session.error,
            msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err)
        res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg)
        res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
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

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}

module.exports = app;
module.exports = User;
http.createServer(app).listen(3000);