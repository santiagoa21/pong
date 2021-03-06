
/**
 *  Application drive
 * 
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

//var usersRouter = require('./routes/users');
var routes = require('./routes/index');
var users = require('./routes/users');

//const { toNamespacedPath } = require('path');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// handle file uploads 
//app.use(multer({dest: './uploads'}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/', routes);

// handle sessions
  app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
  }));
  /*
     const form = document.getElementById('form');
     const log = document.getElementById('log');
     form.addEventListener('submit', logSubmit);*/

    // passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    // express  validator
     app.use(expressValidator({
      errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
       , root    = namespace.shift()
       , formParam = root;

      while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

    // more middleware
    app.use(require('connect-flash')());
    app.use(function (req, res, next){
      res.locals.messages = require('express-messages')(req, res);
      next();
    });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
  app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
