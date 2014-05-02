var User = require('../app/models/user');
var Glitch = require('../app/models/glitch');
var util = require('util');
var fs = require('fs');
var mkpath = require('mkpath');
var rootdir = require('../rootdir');

module.exports = function(req, res) {
  User.findOne({ 'email' : req.param('target_wizard') } , function(err, targetWizard) {
    if (!err) {
      if (targetWizard !== null) {
        if (isValidGlitch(req)) {
          var glitch = new Glitch();
          glitch.sourceWizard = req.user.id;
          glitch.targetWizard = targetWizard.id;

          var name = getGlitchName(req); 
          var relPath = util.format('data/%s/%s', glitch.sourceWizard, glitch.targetWizard);
          var dirPath = util.format('%s/%s', rootdir(), relPath);
          var path = util.format('%s/%s', dirPath, name);
          glitch.resourcePath = util.format('%s/%s', relPath, name);
          console.log(name);
          console.log(relPath);
          console.log(dirPath);
          console.log(path);
          console.log(glitch.resourcePath);

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

var getGlitchName = function(req) {
  var date = new Date();
  var name;
  if (req.files.image.type === 'image/jpeg') {
    name = util.format('%s.jpg', date.getTime());
  }
  else {
    name = util.format('%s.gif', date.getTime());
  }
  return name;
}

var isValidGlitch = function(req) {
  return req.files.image && req.files.image.type === 'image/jpeg' || req.files.image.type === 'image/gif';
}
