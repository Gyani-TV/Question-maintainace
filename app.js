var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
const Handlebars = require('handlebars');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
require('dotenv').config(); //load the environmet variables into process.env
var MongoStore = require('connect-mongo')(session);

// Import function exported by newly installed node modules.
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


//database server connectivity options --- safety 

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  //reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  //reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};

//connect to MongoDB
mongoose.connect(`${process.env.DB_STAGING}` ,options);
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});


var employeeRouter = require('./routes/empl');
//var messagingRouter = require('./routes/mesg');
var indexRouter = require('./routes/index')
var questionsRouter = require('./routes/questionController')
var levelsRouter = require('./routes/levelsManager')
var subjectsRouter = require('./routes/subjectsController')
var app = express();

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
    autoRemove: 'interval',
    autoRemoveInterval: 15 // In minutes. Default
  })
}));

// view engine setup
app.engine('.hbs', expressHbs({
      defaultLayout: 'layout', 
      extname: '.hbs',
      handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', '.hbs');

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  //debug('Listening on ' + bind);
  
}

//app http overload protection middleware on server
const protectCfg = {
  production: process.env.NODE_ENV === 'production', // if production is false, detailed error messages are exposed to the client
  clientRetrySecs: 1, // Client-Retry header, in seconds (0 to disable) [default 1]
  sampleInterval: 5, // sample rate, milliseconds [default 5]
  maxEventLoopDelay: 42, // maximum detected delay between event loop ticks [default 42]
  maxHeapUsedBytes: 0, // maximum heap used threshold (0 to disable) [default 0]
  maxRssBytes: 0, // maximum rss size threshold (0 to disable) [default 0]
  errorPropagationMode: false, // dictate behavior: take over the response 
                              // or propagate an error to the framework [default false]
  logging: false, // set to string for log level or function to pass data to
  logStatsOnReq: false // set to true to log stats on every requests
}
const protect = require('overload-protection')('express', protectCfg)
app.use(protect)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/emp', employeeRouter);
app.use('/questions', questionsRouter);
app.use('/levels', levelsRouter);
app.use('/subjects', subjectsRouter);

//get monitoring support for the server  route /status
app.use(require('express-status-monitor')());

//set the host port properties to allow custom beheaviour
const port = normalizePort(process.env.APP_PORT || 8080);
const host = process.env.APP_HOST || '127.0.0.1';

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
//flash user messages for descriptive alerts
app.use(require('flash')());
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  res.render('error');
});

//start listening on the endpoint
var server= app.listen(port, host);
console.log(`Server listening at ${host}:${port}`);
server.on('error', onError);
server.on('listening', onListening);


server.close(); // release the server port
module.exports = app;
