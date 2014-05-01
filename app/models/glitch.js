var mongoose = require('mongoose');

var glitchSchema = mongoose.Schema({
  sourceWizard : String,
  targetWizard : String,
  resourcePath : String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Glitch', glitchSchema);
