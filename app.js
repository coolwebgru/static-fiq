var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var https = require('https');

var index = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(function(req,res,next) {
    if (process.env.HEROKU === '1' && req.headers['x-forwarded-proto'] === 'http') {
        res.redirect('https://' + req.get('host') + req.originalUrl);
    } else {
        next();
    }
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/users', users);

app.use('/api/v2/*', function(req, res) {
  var options = {};
  options = {
    host: process.env.API_HOST,
    port: process.env.API_PORT,
    path: process.env.API_PREFIX + req.originalUrl.substring(8),
    headers: {
      'X-CFAF-Organization-Id':process.env.API_ORGANIZATION_ID
    },
    method: req.method,
  };

  if (req.headers['cookie']) {
    options.headers['cookie'] = req.headers['cookie'];
  }

  if (req.headers['content-type']) {
    options.headers['content-type'] = req.headers['content-type'];
  }

  var responseHandler = function(res2) {
    if (res2.headers['set-cookie']) {
      var setCookie = res2.headers['set-cookie'].filter(function(cookie) { return cookie.indexOf('CfafAuthToken=') == 0; });
      if (setCookie.length > 0) {
        res.setHeader('Set-Cookie', setCookie);
      }
    }

    res.status(res2.statusCode);

    res2.pipe(res);
  };

  var req2 = process.env.API_HTTPS === '1' ? https.request(options, responseHandler) : http.request(options, responseHandler);

  req2.write(JSON.stringify(req.body));

  req2.end();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
