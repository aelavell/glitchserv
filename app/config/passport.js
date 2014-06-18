var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-account-create', new LocalStrategy({
    passReqToCallback : true
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

  passport.use('local-account-login', new LocalStrategy({
    passReqToCallback : true 
  },
  function(req, username, password, done) {
    User.findOne({ 'username' :  username }, function(err, user) {
      if (err)
          return done(err);

      if (!user)
        return done(null, false, { 'status' : { 'name' : 'NoUserError', 'message' : 'No user found.' } }); 

      if (!user.validPassword(password))
        return done(null, false, { 'status' : { 'name' : 'WrongPasswordError', 'message' : 'Wrong password.' } });

      return done(null, user);
    });
  }));
};
