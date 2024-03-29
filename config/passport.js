// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {
  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup-app', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      var email = req.param('email');
      User.findOne({ $or : [ { 'username' : username } , { 'email' :  email } ] }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if theres already a user with that email
        if (user) {
          if (user.username === username) {
            return done(null, false, { 'status' : { 'name' : 'UsernameAlreadyRegisteredError', 'message' : 'That username is already taken.'}  });
          }
          else if (user.email === email) {
            return done(null, false, { 'status' : { 'name' : 'EmailAlreadyRegisteredError', 'message' : 'That email is already taken.'}  });
          }
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();

          // set the user's local credentials
          newUser.email    = email;
          newUser.password = newUser.generateHash(password);
          newUser.username = username;
          newUser.latitude = req.param('latitude');
          newUser.longitude = req.param('longitude');

          // save the user
          newUser.save(function(err) {
            if (err)
                throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login-app', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'username' :  username }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err)
          return done(err);

      // if no user is found, return the message
      if (!user)
        return done(null, false, { 'status' : { 'name' : 'NoUserError', 'message' : 'No user found.' } }); 

      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false, { 'status' : { 'name' : 'WrongPasswordError', 'message' : 'Wrong password.' } });

      // all is well, return successful user
      return done(null, user);
    });
  }));

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) { // callback with email and password from our form
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'username' :  username }, function(err, user) {
      // if there are any errors, return the error before anything else
      if (err)
          return done(err);

      // if no user is found, return the message
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

      // all is well, return successful user
      return done(null, user);
    });
  }));
};
