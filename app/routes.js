var castGlitch = require('./api/castGlitch');
var getGlitches = require('./api/getGlitches');
var allGlitches = require('./api/allGlitches');
var allWizards = require('./api/allWizards');
var likes = require('./api/likes');
var signS3 = require('./api/signS3');
var apns = require('./api/apns');

//var glitchfeed = require('../public/app/controllers/glitchfeed');

var User = require('./models/user');

module.exports = function(app, passport) {
  //app.get('/', glitchfeed);

  var account = require('./api/account')(passport);

  app.post('/api/v1/account/create.json', account.create);   
  app.post('/api/v1/account/login.json', account.login);   
  
  app.get('/glitches', isLoggedIn, getGlitches);
  app.get('/allGlitches', allGlitches);
  app.post('/glitch', isLoggedIn, castGlitch);
  app.get('/sign_s3', signS3);
  app.get('/wizards', isLoggedIn, allWizards);
  app.post('/registerAPNSToken', isLoggedIn, apns.registerToken);
  app.post('/likeToggle', isLoggedIn, likes.likeToggle);
  app.post('/likeCount', isLoggedIn, likes.likeCount);
  app.post('/likes', isLoggedIn, likes.likes);
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.json(
    { 'status' : { 'name' : 'AuthenticationError', 'message' : 'You are not logged in.' } } 
  );
};
