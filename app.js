
/**
 * Module dependencies.
 */

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var connectAssets = require('connect-assets');
var edge = require('edge');



var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');



//Controllers
var userController = require('./controllers/user');
var displayController = require('./controllers/display');
var homeController = require('./controllers/home');


//Authentication
var secrets = require('./config/secrets');
var passportConf = require('./config/passport');

//connect
var app = express();



// Monk/Mongo
mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});


// Express Configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('your secret here'));
app.use(express.json());
app.use(express.urlencoded());
app.use(expressValidator());
app.use(express.methodOverride());
app.use(express.session({
  secret: secrets.sessionSecret,
  store: new MongoStore({
    url: secrets.db,
    auto_reconnect: true
  })
}));
app.use(express.csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.token = req.csrfToken();
  res.locals.secrets = secrets;
  next();
});
app.use(flash());
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());

/**
 * Express Config Backup
 *
 *
 * 
 *
 */



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}

/**
 *Application Routes
 */


//Gets
app.get('/', routes.index);
app.get('/signup', routes.signup);
app.post('/signup', userController.postSignup)

app.get('/login', routes.login);
app.post('/login', userController.postLogin);

app.get('/newcont', passportConf.isAuthenticated, routes.newcont);
app.post('/newcont', userController.postNewCont);

app.get('/logout', userController.logout);



app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);

app.get('/display', passportConf.isAuthenticated, displayController.getDisplay);
app.get('/display/:displayParam', passportConf.isAuthenticated, displayController.getDisplay);
app.get('/display2', passportConf.isAuthenticated, displayController.getDisplay2);



app.listen(app.get('port'), function(){
	console.log("Express Server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
module.exports = app;
