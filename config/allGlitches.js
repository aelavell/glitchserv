var Glitch = require('../app/models/glitch');
var _ = require('underscore');
var utility = require('../app/utility');
var constants = require('../app/constants');

module.exports = function(req, res) {
  var lastID = req.param('last_id');
  var firstID = req.param('first_id');

  var sendResultOrError = function(err, result) {
      if (!err) {
        res.json(result);
      }
      else {
        sendError('DatabaseError', err);
      }
  }

  var glitchFound = function(err, glitch) {
    console.log('glicfosad');
    if (!err) {
      if (utility.exists(glitch)) {
        if (utility.exists(lastID)) paginate(sendResultOrError, { 'timestamp' : { $lt : glitch.timestamp } });
        else paginate(sendResultOrError, { 'timestamp' : { $gt : glitch.timestamp } });
      }
      else {
        paginate(sendResultOrError, { 'timestamp' : { $lte : new Date } });
      }
    }
    else {
      paginate(sendResultOrError, { 'timestamp' : { $lte : new Date } });
    }
  }

  if (utility.exists(lastID)) {  
    Glitch.findOne({ '_id' : lastID }, glitchFound);
  }
  else if (utility.exists(firstID)) {
    Glitch.findOne({ '_id' : firstID }, glitchFound);
  }
  else {
    paginate(sendResultOrError, { 'timestamp' : { $lte : new Date } });
  }
}

function sendError(name, message) {
  res.json( { 
    'status' : { 'name' : name, 'message' : message }
  });
  console.error(err);
}

function paginate(callback, query) {
  Glitch
  .find(query) 
  .limit(constants.pageSize)
  .sort('-timestamp')
  .exec(callback);
}
