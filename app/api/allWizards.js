var User = require('../models/user');
var _ = require('underscore');

module.exports = function(req, res) {
  User.find(function(err, wizards) {
    res.json(_.map(wizards, function(wizard) {
      return { "_id" : wizard.id, "username" : wizard.username, "latitude" : wizard.latitude, "longitude" : wizard.longitude }; 
    })); 
  });
}
