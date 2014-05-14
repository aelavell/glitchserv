var User = require('../app/models/user');
var Glitch = require('../app/models/glitch');
var util = require('util');
var fs = require('fs');
var mkpath = require('mkpath');
var rootdir = require('../rootdir');
var apns = require('./apns');

module.exports = function(req, res) {
  User.findOne({ '_id' : req.param('target_wizard') } , function(err, targetWizard) {
    if (!err) {
      if (!isValidGlitchType(req)) {
        res.json({ 'status' : 
          { 'name' : 'InvalidGlitchTypeError',
            'message' : 'Invalid glitch image type. Must be jpeg or gif.'
          }
        });
      }
      else if (!isValidTarget(req, targetWizard)) {
        res.json({ 'status' : 
          { 'name' : 'InvalidTargetWizardError',
            'message' : 'Invalid target wizard. Must be a wizard other than oneself.'
          }
        });
      }
      else {
        var glitch = new Glitch();
        glitch.sourceWizard = req.user.id;
        glitch.targetWizard = targetWizard.id;

        var name = getGlitchName(req); 
        var relPath = util.format('%s/%s/%s', glitch.sourceWizard, glitch.targetWizard, name);
        var path = util.format('https://s3.amazonaws.com/glitchwizard/%s', relPath);
        console.log(relPath);
        console.log(path);
        glitch.resourcePath = path;

        glitch.save(function(err) {
            if (err) {
              res.json(
                { 'status' : {
                  'name' : 'DatabaseError',
                  'message' : err
                  }
                }
              );
              throw err;
            }
            else {
              if (targetWizard.apnToken != glitch.resourcePath) {
                apns.sendAPN(req.user, targetWizard); 
              }
              else {
                console.log(targetWizard.apnToken);
                console.log(glitch.resourcePath);
              }
              

              res.json({ 'status' : {
                'name' : 'Success',
                'message' : 'Glitch successfully entered into database.'
               },
                'filename' : relPath
              }
              );
            }
        });
      }
    }
    else {
      console.log(err); 
      res.json(
      { 'status' : 
        { 'name' : 'InvalidWizardError',
          'message' : 'Invalid wizard.'
        }
      });
    }
  });
}

var getGlitchName = function(req) {
  var date = new Date();
  var name;
  if (req.param('image_type') === 'image/jpeg') {
    name = util.format('%s.jpg', date.getTime());
  }
  else if (req.param('image_type') === 'image/gif') {
    name = util.format('%s.gif', date.getTime());
  }
  return name;
}

var isValidGlitchType = function(req) {
  return req.param('image_type') === 'image/jpeg' || req.param('image_type') === 'image/gif';
}

var isValidTarget = function(req, target_wizard) {
  return req.user.id != target_wizard.id;
}
