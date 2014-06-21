var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  firstName:  String,
  lastName: String,
  password: String,
  apnToken: String
});

userSchema.methods.generateHash = function(password, callback) {
  bcrypt.genSalt(8, function(error, result) {
    bcrypt.hash(password, result, null, callback);
  });
};

userSchema.methods.validPassword = function(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

module.exports = mongoose.model('User', userSchema);
