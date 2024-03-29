var castGlitch = require('../config/castGlitch');
var getGlitches = require('../config/getGlitches');
var allGlitches = require('../config/allGlitches');
var allWizards = require('../config/allWizards');
var glitchfeed = require('../app/controllers/glitchfeed');
var likes = require('../config/likes');
var signS3 = require('../config/signS3');
var apns = require('../config/apns');
var User = require('../app/models/user');

module.exports = function(app, passport) {
  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/login', function(req, res) {
    res.render('login.ejs', { message : req.flash('loginMessage') });
  });

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.get('/account', function(req, res) {
    res.render('account.ejs');
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user: req.user
    });
  });

  app.get('/glitchfeed', glitchfeed);

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/glitches', isLoggedIn, getGlitches);

  app.get('/allGlitches', allGlitches);

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));   

  app.post('/signupApp', function(req, res, next) {
    passport.authenticate('local-signup-app', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.json({ 'status' : info }); }
      if (user) { 
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.json({ 
            'status' : { 'name' : 'Success', 'message' : 'Registration successful.' },
            '_id' : user._id
          });
        });
      }
    })(req, res, next);
  });   

  app.post('/loginApp', function(req, res, next) {
    passport.authenticate('local-login-app', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.json({ 'status' : info }); }
      if (user) { 
        req.logIn(user, function(err) {
          if (err) { return next(err); }

          return res.json({ 
            'status' : { 'name' : 'Success', 'message' : 'Login successful.' },
            '_id' : user._id
          });
        });
      }
    })(req, res, next);
  });   

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

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
}
