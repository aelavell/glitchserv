var User = require('../app/models/user');
var Glitch = require('../app/models/glitch');
var _ = require('underscore');

module.exports = function(req, res) {
  Glitch.find({ 'sourceWizard' : req.user.id }, function(err, glitches) {
    console.log("glitches sent: ");
    _.each(glitches, function(glitch) {
      console.log(glitch.resourcePath);
    });
  });
  Glitch.find({ 'targetWizard' : req.user.id }, function(err, glitches) {
    console.log("glitches received: ");
    _.each(glitches, function(glitch) {
      console.log(glitch.resourcePath);
    });
  });
}
