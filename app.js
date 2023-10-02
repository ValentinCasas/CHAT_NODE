var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const io = require('./bin/www');

const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const bodyparser = require('body-parser');
const upload = require("express-fileupload");

const jwt = require("jsonwebtoken");
const secretKey = "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY4OTg3OTYzMCwiaWF0IjoxNjg5ODc5NjMwfQ.EW7Yk6kbmR5s3L1MeyVNoV8x4_T3FZOLPBYPOdO6KJQ";

const authRouter = require('./routes/auth').router;
const isAutenticated = require('./routes/auth').isAutenticated;
const chatRouter = require('./routes/chat');

var app = express();

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "oD8xq9t#G?63$YLz2*",
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'fonts')));
app.use(express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'public/jQuery')));
app.use(express.static(path.join(__dirname, 'public/javascripts')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/avatars')));
app.use(express.static(path.join(__dirname, 'public/img-por-defecto')));
app.use(express.static(path.join(__dirname, 'public/svg')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(upload({ limits: { fileSize: 10 * 1024 * 1024 } }));
app.use(cookieParser());

app.use(function (req, res, next) {
  if (!req.path.startsWith("/auth")) {
    const token = req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
      } catch (error) {
        console.error("Token inválido ", error);
      } {

      }
    }
  }
  
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  next();
});


app.use('/', authRouter);
app.use('/auth', authRouter);
app.use('/chat', chatRouter);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
