var Glitch = require('../app/models/glitch');
var _ = require('underscore');
var utility = require('../app/utility');

var pageSize = 10;

module.exports = function(req, res) {
  var lastID = req.param('last_id');

  var callback = function(err, glitches) {
    res.json(glitches);
  }

  if (utility.existy(lastID)) {  
    Glitch.findOne( { '_id' : lastID }, function(err, glitch) {
      if (!err) {
        if (utility.existy(glitch)) {
          console.log("1");
          Paginate(glitch.timestamp, callback);
        }
        else {
          console.log("2");
          Paginate(new Date(), callback); 
        }
      }
      else {
        res.json( { 
          'status' : { 'name' : 'DatabaseError', 'message' : err }
        });
        console.log(err);
      }
    });
  }
  else {
    console.log("3");
    Paginate(new Date(), callback);
  }
}

function Paginate(timestamp, callback) {
  console.log(timestamp);
  Glitch
  .find( { 'timestamp' : { '$gt' : timestamp } } )
  .limit(pageSize)
  .sort('-timestamp')
  .exec(callback);
}
