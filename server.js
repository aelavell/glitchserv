var express = require('express');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);
var passport = require('passport'); 
var flash = require('connect-flash');
var path = require('path');
var configDB = require('./config/database.js');

var app = express();

mongoose.connect(configDB.url);

require('./config/passport')(passport); 

app.use(express.logger('dev')); 
app.use(express.cookieParser()); 
app.use(express.bodyParser()); 
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', path.join(__dirname, 'views')); 

app.use(express.session({ 
  store: new mongoStore({url: configDB.url}),
  secret: process.env.SESSION_SECRET, 
  cookie : { maxAge: 420 * 60000 } 
})); 

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port ' + port);
