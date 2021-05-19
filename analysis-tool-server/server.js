const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morganLogger = require('./config/morgan-logger');
const winstonLogger = require('./config/winston-logger');
const router = require('./src/api/routes/index');
      //db = require('./config/db'),
      app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(db);
app.use(morganLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

// catch 404 and forward to error handler 
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  winstonLogger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
