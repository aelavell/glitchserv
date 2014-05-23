var Glitch = require('../app/models/glitch');
var __ = require('../app/utility');

exports.likeToggle = function(req, res) {
  var glitchID = req.param('glitch_id');
  if (__.verifyParameter(glitchID, res, __.isHexString)) {
    Glitch
    .findById(glitchID)
    .exec(function(err, glitch) { 
      glitch.toggleLike(req.user.id);    
      glitch.save(function(err) { 
        if (err) { __.fail('DatabaseSaveError', err, res); }
        else { __.succeed('SuccessfulLike', ''); }
      });
    });
  }
}

exports.likeCount = function(req, res) {
  var glitchID = req.param('glitch_id');
  if (__.verifyParameter(glitchID, res, __.isHexString)) {
    Glitch
    .findById(glitchID)
    .exec(function(err, glitch) { 
      if (err) { __.fail('DatabaseError', err, res); }
      else {
        if (__.exists(glitch)) {
          res.json(glitch.likeCount());
        }
        else {
          __.fail('InvalidIDError', 'The requested glitch does not exist');
        }
      }
    });
  }
}

exports.likes = function(req, res) {
  var glitchID = req.param('glitch_id');
  if (__.verifyParameter(glitchID, res, __.isHexString)) {
    Glitch
    .findById(glitchID)
    .exec(function(err, glitch) { 
      if (err) { __.fail('DatabaseError', err, res); }
      else {
        if (__.exists(glitch)) {
          res.json(glitch.Likes);
        }
        else {
          __.fail('InvalidIDError', 'The requested glitch does not exist');
        }
      }
    });
  }
}
