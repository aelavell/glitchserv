var User = require('../app/models/user');
var Glitch = require('../app/models/glitch');
var util = require('util');
var fs = require('fs');
var mkpath = require('mkpath');
var rootdir = require('../rootdir');

module.exports = function(req, res) {
  User.findOne({ 'local.email' : req.param('target_wizard') } , function(err, targetWizard) {
    if (!err) {
      if (targetWizard !== null) {
        if (isValidGlitch(req)) {
          var date = new Date();
          var glitch = new Glitch();
          glitch.sourceWizard = req.user.id;
          glitch.targetWizard = targetWizard.id;

          var dirPath = util.format('%s/data/%s/%s', rootdir(), glitch.sourceWizard, glitch.targetWizard);
          
          var path;
          if (req.files.image.type === 'image/jpeg') {
            path = util.format('%s/%s.jpg', dirPath, date.getTime());
          }
          else {
            path = util.format('%s/%s.gif', dirPath, date.getTime());
          }
          glitch.resourcePath = path;

          mkpath(dirPath, function(err) {
            if (err) throw err;

            fs.readFile(req.files.image.path, function (err, data) {
              fs.writeFile(path, data, function (err) {
                if (err) throw err;
              });
            });
          });
          
          glitch.save(function(err) {
              if (err) throw err;
          });
        }
      } 
      else {
        // let them know the target wizard doesn't exist 
        console.log('invalid wizard: ' + req.param('target_wizard'));
      }
    }
    else {
      console.log(err); 
    }
  });
  res.redirect('/profile');
}

var isValidGlitch = function(req) {
  return req.files.image && req.files.image.type === 'image/jpeg' || req.files.image.type === 'image/gif';
}
