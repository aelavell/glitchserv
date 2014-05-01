var mongoose = require('mongoose');

var glitchSchema = mongoose.Schema({
  sourceWizard : String,
  targetWizard : String,
  resourcePath : String
});

module.exports = mongoose.model('Glitch', glitchSchema);
