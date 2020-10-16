var createError = require('http-errors');
var express = require('express');
var socket_io = require('socket.io');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require('passport'); // A middleware for authentication of users.
var authenticate = require('./authenticate'); // authentication strategy defined.

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRouter');
var medicineRouter = require('./routes/medicineRouter');
var healthPostRouter = require('./routes/healthPostRouter');
var vaccineRouter = require('./routes/vaccineRouter');
var suppliersRouter = require('./routes/suppliersRouter');
var bloodRouter = require('./routes/bloodRouter');
var orderRouter = require('./routes/orderRouter');
var missionRouter = require('./routes/missionRouter');
var droneRouter = require('./routes/droneRouter');
var hospitalRouter = require('./routes/hospitalRouter');
var dashboardRouter = require('./routes/dashboard');
var placesRouter = require('./routes/placesRouter');
var healthFacilitiesRouter = require('./routes/healthFacilitiesRouter');
var dmsEventRouter = require('./routes/dmsEventRouter');

var mongoose = require('mongoose'); // Mongoose to interact with mongodb database
var mongoose_init = require('./models/db'); // Initialiation/connection with mongodb database

var app = express();

// Socket.io initialized
const io = socket_io();
app.io = io;
require('./socket/socket_init')(io);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(passport.initialize()); // Initialize passport to use as a middleware.

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/medicines', medicineRouter);
app.use('/healthpost', healthPostRouter);
app.use('/vaccine', vaccineRouter);
app.use('/suppliers', suppliersRouter);
app.use('/blood', bloodRouter);
app.use('/orders', orderRouter(io));
app.use('/mission', missionRouter);
app.use('/drones', droneRouter);
app.use('/hospital', hospitalRouter);
app.use('/dashboard', dashboardRouter);
app.use('/places', placesRouter);
app.use('/healthFacilities', healthFacilitiesRouter);
app.use('/dmsevent', dmsEventRouter);

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
  // res.render('error');
  // json error response
  res.json({
    status: false,
    message: err.message
  });
});

module.exports = app;