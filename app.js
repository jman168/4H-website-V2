var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger = require('morgan');
var expressHsb = require('express-handlebars');
var flash = require('express-flash');

var secret = require(process.env['HOME']+'/secret');

var index_Router = require('./routes/index');
var record_books_Router = require('./routes/record-books');
var user_Router = require('./routes/user');


var app = express();

// view engine setup
app.engine('.hbs', expressHsb({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: secret, resave: false, saveUninitialized: false}))
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index_Router);
app.use('/record-books', record_books_Router);
app.use('/user', user_Router);


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
