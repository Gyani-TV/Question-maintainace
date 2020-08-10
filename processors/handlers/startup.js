
var createError = require('http-errors');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
// require('dotenv').config(); //load the environmet variables into process.env
var MongoStore = require('connect-mongo')(session);

const open = require( "open" );

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

// no usage of okta for login management as of now ---- no need for pkce login

 module.exports = async ( { serverPort, serverHostAddress, dbName } ) => {
 if ( !oktaOrgUrl || !clientId || !scopes || !serverPort ) {
   console.log(' org url', serverPort)
   console.log(' org url', serverHostAddress)
   console.log(' org url', dbName)

   throw new Error( "Missing parameters to start the process. Notify developers about the issue" );
 }

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

var app = express();

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/emp', employeeRouter);

//add this varible for middleware
// const admin = require('./firebase-admin');  => not required as per project of online student management

//set the host port properties to allow custom beheaviour
var port = serverPort || 8080;
var host = serverHostAddress || '127.0.0.1';

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler  make this into a seperate middleware
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  res.render('error');
});

const executeServerFlow= () => {
return new Promise( async ( resolve, reject )=> {
  try {
    var server=await app.listen(port, host);
    resolve( { server } );
    return server;
  }catch (err) {
    reject( err );
  }
  var authorizeUrl= `${host}:${port}`
  open( authorizeUrl );
})
  
}


server.close(); // release the server port

};