var Glitch = require('../app/models/glitch');
var _ = require('underscore');

module.exports = function(req, res) {
  Glitch
  .find({ $or: [ { 'sourceWizard' : req.user.id } , { 'targetWizard' : req.user.id } ]  })
  .sort('-timestamp')
  .exec(  
    function(err, glitches) {
      res.json(glitches);
    } 
  );
}
