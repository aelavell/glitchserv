exports.buildMissingParameterError = function(parameterName) { 
  return {'code': 1, 'message' : 'Missing required request parameter: ' + parameterName};
};
exports.usernameExceedsCharacterLimitError = {'code' : 2, 'message' : 'Requested username exceeds 16 character limit.'};
exports.databaseError = {'code' : 3, 'message': 'Database error.' };
exports.usernameExistsError = {'code': 4, 'message': 'Requested username already exists.'};
exports.invalidEmailFormatError = {'code': 5, 'message': 'Given email isn\'t a real email address.'};
exports.emailExistsError = {'code': 6, 'message': 'Requested email already exists.'};
exports.firstNameExceedsCharacterLimitError = {'code' : 7, 'message' : 'Requested first name exceeds 16 character limit.'};
exports.lastNameExceedsCharacterLimitError = {'code' : 8, 'message' : 'Requested last name exceeds 16 character limit.'};
exports.passwordTooShortError = {'code': 9, 'message': 'Password must be 6 characters or longer.'};
exports.passwordHashingError = {'code': 10, 'message': 'Unable to hash new password.'};
exports.missingCredentialsError = {'code': 11, 'message': 'Missing credentials'};
exports.loginError = {'code': 12, 'message' : 'Credentials are valid, but there was an error logging in.'};
exports.invalidUsernameError = {'code': 13, 'message': 'Invalid username.'};
exports.invalidPasswordError = {'code': 14, 'message': 'Invalid password.'};
