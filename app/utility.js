var _ = require('underscore');

exports.exists = function(x) { return x != null; }

exports.logAndSendError = function(err, res) {
  console.error(err);
  res.json(err);
}

exports.isHexString = function(x) {
  return _.isString(x) && x.match(/[0-9a-fA-F]+/); 
}

exports.statusObject = function(name, message) {
  return { 'status' : { 'name' : name, 'message' : message } };
}

exports.verifyParameter = function(param, res, verificationPredicate) {
  if (exists(param)) {
    if (verificationPredicate(param)) {
      return true;
    }
    else {
      logAndSendError(statusObject('ParameterVerificationError', 'Invalid input for parameter ' + parameterName), res);
      return false;
    }
  }
  else {
    logAndSendError(statusObject('ParameterMissingError', 'Missing input for parameter ' + parameterName), res);
    return false;
  }
}

exports.sendResultOrError = function(err, result, res) {
  if (exists(err)) {
    logAndSendError(exports.statusObject('DataBaseError', err), res);
  }
  else {
    res.json(result);
  }
}
