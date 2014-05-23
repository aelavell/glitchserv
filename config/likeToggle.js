var Glitch = require('../app/models/glitch');
var __ = require('../app/utility');

module.exports = function(req, res) {
  var glitchID = req.param('glitch_id');
  if (__.verifyParameter(glitchID, res, __.isHexString)) {
    Glitch
    .findOne({ '_id' : glitchID })
    .sort('-timestamp')
    .exec(function(err, glitch) { 
      glitch.toggleLike(req.user.id);    
      glitch.save(function(err) { __.logAndSendError(__.statusObject('DatabaseSaveError', err), res); });
    });
  }
}
