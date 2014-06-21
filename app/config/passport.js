var LocalStrategy = require('passport-local').Strategy;
var validation = require('../validation');
var User = require('../models/user');
var errorDefs = require('../errorDefinitions');
var util = require('../utility');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-account-login', new LocalStrategy({
    passReqToCallback : true 
  },
  function(req, username, password, done) {
    console.log('bloggin in');
    username = username.toLowerCase();
    User.findOne({ 'username' :  username }, function(err, user) {
      if (err)
          return done(err);

      if (!user)
        return done(null, false, { 'status' : { 'name' : 'NoUserError', 'message' : 'No user found.' } }); 

      user.validPassword(password, function(error, isValid) {
        if (isValid) {
          return done(null, false, { 'status' : { 'name' : 'WrongPasswordError', 'message' : 'Wrong password.' } });
        }
        else {
          return done(null, user);
        }
      });
    });
  }));
};