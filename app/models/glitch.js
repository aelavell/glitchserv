var mongoose = require('mongoose');
var _ = require('underscore');
var __ = require('../utility');

var glitchSchema = mongoose.Schema({
  sourceWizard : String, // should be sourceWizardID to minimize confusion
  targetWizard : String, // OLD: replaced by targetWizardIDs
  targetWizardIDs : Array,
  resourcePath : String,
  timestamp: { type: Date, default: Date.now },
  likeWizardIDs : Array
});

glitchSchema.methods.toggleLike = function(wizardID) {
  if (__.exists(likeWizardIDs)) { 
    if (!_.contains(likeWizardIDs, wizardID)) {
      likeWizardIDs.push(wizardID);
    }
    else {
      likeWizardIDs = _.without(likeWizardIDs, wizardID);
    }
  }
}

module.exports = mongoose.model('Glitch', glitchSchema);
