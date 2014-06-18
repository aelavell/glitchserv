module.exports = function(passport) {
  var account = {};
  account.create =  function(req, res, next) {
    passport.authenticate('local-account-create', function(err, user, info) {
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
  };

  account.login = function(req, res, next) {
    passport.authenticate('local-account-login', function(err, user, info) {
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
  };

  return account;
};
