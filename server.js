var express = require('express');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);
var path = require('path');
var constants = require('./app/config/constants');

var passport = require('passport'); 
require('./app/config/passport')(passport); 

var port = process.env.PORT || 8080;

var app = express();

mongoose.connect(constants.databaseURL);

app.use(express.logger('dev')); 
app.use(express.cookieParser()); 
app.use(express.bodyParser()); 
app.use(express.static(path.join(__dirname, 'public')));

//app.set('view engine', 'ejs'); // set up ejs for templating
//app.set('views', path.join(__dirname, 'views')); 

app.use(express.session({ 
  store: new mongoStore({ url: constants.databaseURL }),
  secret: process.env.SESSION_SECRET, 
  cookie : { maxAge: 420 * 60000 } 
})); 

app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port ' + port);
