var Glitch = require('../models/glitch'); 

module.exports = function(req, res) {
  Glitch
  .find()
  .limit(420)
  .sort('-timestamp')
  .exec(  
    function(err, glitches) {
      res.render('glitchfeed.ejs', { 'glitches' : glitches });
    }
  );
}
