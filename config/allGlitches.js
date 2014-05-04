var Glitch = require('../app/models/glitch');
var _ = require('underscore');

module.exports = function(req, res) {
  Glitch
  .find()
  .limit(420)
  .sort('-timestamp')
  .exec(  
    function(err, glitches) {
      res.json(glitches);
    } 
  );
}
