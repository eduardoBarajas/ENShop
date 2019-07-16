var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('file-system');  
var bodyParser = require('body-parser');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
var helmet = require('helmet');
var compression = require('compression');
var session = require('cookie-session');

// Aqui se define como se debe comportar las cookies
var expireDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
app.use(session({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: { secure: true,
            httpOnly: true,
            domain: 'example.com',
            path: 'foo/bar',
            expires: expireDate
          }
  })
);

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true});
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// se utiliza gzip para disminuir el tamanio de la respuesta dando mas rendimiento
app.use(compression());

// helmet es un conjunto de middlewares para proteger las cabeceras contra ataques
app.use(helmet());

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'assets')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

fs.readdirSync('controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        const route = require('./controllers/' + file);
        route.controller(app);
    }
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
