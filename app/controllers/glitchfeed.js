var Glitch = require('../models/glitch'); 
var utility = require('../utility');

var pageSize = 20;

module.exports = function(req, res) {
  var lastID = req.param('last_id');
  var lastTimestamp;
  if (utility.existy(lastID)) {  
    Glitch.findOne( { '_id' : lastID }, function(err, glitch) {
      if (!err) {
        lastTimestamp = glitch.timestamp;
      }
      else {
        res.json( { 
          'status' : { 'name' : 'PaginationError', 'message' : 'Invalid ID provided for pagination' }
        });
        console.log(err);
      }
    });
  }
  else {
    var date = new Date();
    lastTimestamp = Date.now();
  }

  Glitch
  //.find( { 'timestamp' : { $gt : lasTimestamp } } )
  .find()
  .limit(pageSize)
  .sort('-timestamp')
  .exec(  
    function(err, glitches) {
      res.render('glitchfeed.ejs', { 'glitches' : glitches });
    }
  );
}
