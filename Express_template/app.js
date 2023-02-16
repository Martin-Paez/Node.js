var express = require('express');
var path = require('path');
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

console.log(app.get('env'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('public', path.join(__dirname, 'public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use('/', indexRouter);
indexRouter.use(express.static(app.settings.public, {index: 'index.html'}));
app.use('/users', usersRouter);

module.exports = app;
