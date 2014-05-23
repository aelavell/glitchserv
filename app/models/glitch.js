var mongoose = require('mongoose');
var _ = require('underscore');
var __ = require('../utility');

var glitchSchema = mongoose.Schema({
  sourceWizard : String, // should be sourceWizardID to minimize confusion
  targetWizard : String, // OLD: replaced by targetWizardIDs
  targetWizardIDs : Array,
  resourcePath : String,
  timestamp: { type: Date, default: Date.now },
  likes : Array
});

glitchSchema.methods.toggleLike = function(wizardID) {
  if (__.exists(likes)) { 
    if (!_.contains(likes, wizardID)) {
      likes.push(wizardID);
    }
    else {
      likes = _.without(likes, wizardID);
    }
  }
}

glitchSchema.methods.likeCount = function(wizardID) {
  if (__.exists(likes)) { 
    return likes.length;
  }
  else {
    return 0;
  }
}

glitchSchema.methods.Likes = function() {
  if (__.exists(likes)) {
    return likes;
  }
  else {
    return [];
  }
}

module.exports = mongoose.model('Glitch', glitchSchema);
