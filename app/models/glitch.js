var mongoose = require('mongoose');

var glitchSchema = mongoose.Schema({
  sourceWizard : String, // should be sourceWizardID to minimize confusion
  targetWizard : String, // OLD: replaced by targetWizardIDs
  targetWizardIDs : Array,
  resourcePath : String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Glitch', glitchSchema);
