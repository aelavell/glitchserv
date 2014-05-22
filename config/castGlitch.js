var User = require('../app/models/user');
var Glitch = require('../app/models/glitch');
var util = require('util');
var fs = require('fs');
var mkpath = require('mkpath');
var rootdir = require('../rootdir');
var apns = require('./apns');
var _ = require('underscore');
var utility = require('../app/utility')

extractTargetWizardIDs = function(req) {
  if (utility.exists(req.param('target_wizard'))) {
    return [ JSON.parse(req.param('target_wizard')) ];
  }
  else {
    // TODO: make sure this actually returns an array in the proper format
    console.log(JSON.parse(req.param('target_wizards')));
    return JSON.parse(req.param('target_wizards'));
  }
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

module.exports = function(req, res) {
  if (!isValidGlitchType(req)) {
    res.json({ 'status' : 
      { 'name' : 'InvalidGlitchTypeError',
        'message' : 'Invalid glitch image type. Must be jpeg or gif.'
      }
    });
    return;
  }
  var targetWizardIDs = extractTargetWizardIDs(req);

  User.find({ '_id' : { $in : targetWizardIDs } } , function(err, targetWizards) {
    if (!err) {
      var glitch = new Glitch();
      glitch.sourceWizard = req.user.id;
      glitch.targetWizardIDs = targetWizardIDs;

      var name = getGlitchName(req); 
      var relPath = util.format('%s/%s', glitch.sourceWizard, name);
      var path = util.format('https://s3.amazonaws.com/glitchwizard/%s', relPath);
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
            _.each(targetWizards, function(targetWizard) {
              apns.sendAPN(req.user, targetWizard); 
            });

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
    else {
      res.json(
      { 'status' : 
        { 'name' : 'InvalidTargetWizardError',
          'message' : err
        }
      });
    }
  });
}
