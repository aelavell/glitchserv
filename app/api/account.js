var util = require('../utility');
var _ = require('underscore');
var errorDefs = require('../errorDefinitions');
var validation = require('../validation');
var User = require('../models/user');

module.exports = function(passport) {
  var account = {};

  account.create = function(req, res) {
    var params = ['username', 'password', 'email', 'first_name', 'last_name'];
    validation.validateParametersExisting(req, params, function(err) {
      if (err) { res.json(400, {'errors': [err]}); } 
      else {
        validation.validateUsername(req, function(err) {
          if (err) { res.json(400, {'errors': [err]}); } 
          else {
            validation.validateEmail(req, function(err) {
              if (err) { res.json(400, {'errors': [err]}); } 
              else {
                validation.validateFirstName(req, function(err) {
                  if (err) { res.json(400, {'errors': [err]}); } 
                  else {
                    validation.validateLastName(req, function(err) {
                      if (err) { res.json(400, {'errors': [err]}); } 
                      else {
                        validation.validatePassword(req, function(err) {
                          if (err) { res.json(400, {'errors': [err]}); } 
                          else {
                            var username = req.param('username').toLowerCase();
                            User.findOne({ 'username' : username  }, function(err, user) {
                              if (err) { res.json(400, {'errors': [errorDefs.databaseError]}); } 
                              else {
                                var newUser = new User();

                                newUser.username = username;
                                newUser.email = req.param('email');
                                newUser.firstName = req.param('first_name');
                                newUser.lastName = req.param('last_name');

                                newUser.generateHash('password', function(err, hash) {
                                  if (err) { res.json(400, {'errors': [errorDefs.passwordHashingError]}); } 
                                  else {
                                    newUser.password = hash;

                                    // save the user
                                    newUser.save(function(err) {
                                      if (err) { res.json(400, {'errors': [errorDefs.databaseError]}); } 
                                      else { res.json(200, { 'message': 'Registration successful.' }); }
                                    });
                                  }
                                });
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  account.login = function(req, res) {
    validation.validateParametersExisting(req, ['username', 'password'], function(err) {
      if (err) { return res.json(400, {'errors': [err]});}

      passport.authenticate('local-account-login', function(err, user, info) {
        if (err) { return res.json(400, {'errors' : [err]}); }
        if (!user) { return res.json(400, {'errors' : [info]}); }
        if (user) { 
          req.logIn(user, function(err) {
            if (err) { return res.json(400, {'error' : [errorDefs.loginError]}); }
            return res.json(200, {'message' : 'Login successful.'});
          });
        }
      })(req, res);
    });
  };

  return account;
};
