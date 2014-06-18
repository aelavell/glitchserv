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
    var email = req.param('email');
    username = username.toLowerCase();
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
        newUser.username = username;

        newUser.password = newUser.generateHash(password, function(error, hash) {
          newUser.password = hash;

          // save the user
          newUser.save(function(err) {
            if (err)
                throw err;
            return done(null, newUser);
          });
        });
      }
    });
  }));

  passport.use('local-account-login', new LocalStrategy({
    passReqToCallback : true 
  },
  function(req, username, password, done) {
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
