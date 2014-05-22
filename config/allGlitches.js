var Glitch = require('../app/models/glitch');
var _ = require('underscore');
var utility = require('../app/utility');
var constants = require('../app/constants');

module.exports = function(req, res) {
  var lastID = req.param('last_id');

  var callback = function(err, glitches) {
    if (!err) {
      res.json(glitches);
    }
    else {
      res.json({
        'status' : { 'name' : 'DatabaseError', 'message' : err }
      });
      console.error(err);
    }
  }

  if (utility.existy(lastID)) {  
    Glitch.findOne( { '_id' : lastID }, function(err, glitch) {
      if (!err) {
        if (utility.existy(glitch)) {
          Paginate(glitch.timestamp, callback, false);
        }
        else {
          Paginate(Date.now, callback, true); 
        }
      }
      else {
        res.json( { 
          'status' : { 'name' : 'DatabaseError', 'message' : err }
        });
        console.error(err);
      }
    });
  }
  else {
    Paginate(new Date, callback, true);
  }
}

function Paginate(timestamp, callback, inclusive) {
  // QUEXTION: why can't I use a variable with the string '$lte' in it in
  // mongoose's .find?
  if (inclusive) {
    Glitch
    .find( { 'timestamp' : { '$lte' : timestamp } } ) 
    .limit(constants.pageSize)
    .sort('-timestamp')
    .exec(callback);
  }
  else {
    Glitch
    .find( { 'timestamp' : { '$lt' : timestamp } } ) 
    .limit(pageSize)
    .sort('-timestamp')
    .exec(callback);
  }
}
