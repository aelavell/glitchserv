var User = require('./models/user');
var util = require('./utility');
var errorDefs = require('./errorDefinitions');
var _ = require('underscore');
var validator = require('validator');

var getMissingParams = function(req, params) {
  var missingParams = [];

  _.each(params, function(param) {
    if (!util.exists(req.param(param))) { missingParams.push(param); }
  });
 
  return missingParams;
}

exports.validateParametersExisting = function(req, requiredParameters, callback) {
  var missingParams = getMissingParams(req, requiredParameters);
  if (missingParams.length > 0) {
    callback(errorDefs.buildMissingParameterError(missingParams[0])); // send only the first, as we are doing one error at a time
  }
  else {
    callback(null);
  }
}

exports.validateUsername = function(req, callback) {
  var username = req.param('username').toLowerCase();
  if (username.length > 16) {
    callback(errorDefs.usernameExceedsCharacterLimitError);
  } 
  User.findOne({'username': username}, function(err, result) {
    if (util.exists(err)) { callback(errorDefs.databaseError); }
    else if (util.exists(result)) { callback(errorDefs.usernameExistsError); }
    else { callback(null); }
  });
}

exports.validateEmail = function(req, callback) {
  var email = req.param('email');
  if (!validator.isEmail(email)) {
    callback(errorDefs.invalidEmailFormatError);
  }
  else User.findOne({'email': email}, function(err, result) {
    if (util.exists(err)) { callback(errorDefs.databaseError); }
    else if (util.exists(result)) { callback(errorDefs.emailExistsError); }
    else { callback(null); }
  });
}

exports.validateFirstName = function(req, callback) {
  var firstName = req.param('first_name');
  if (firstName.length > 16) {
    callback(errorDefs.firstNameExceedsCharacterLimitError);
  }
  else {
    callback(null);
  }
}

exports.validateLastName = function(req, callback) {
  var lastName = req.param('last_name');
  if (lastName.length > 16) {
    callback(errorDefs.lastNameExceedsCharacterLimitError);
  }
  else {
    callback(null);
  }
}

exports.validatePassword = function(req, callback) {
  var password = req.param('password');
  if (password.length < 6) {
    callback(errorDefs.passwordTooShortError);
  }
  else {
    callback(null);
  }
}
