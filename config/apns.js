var apn = require('apn');
var User = require('../app/models/user');
var _ = require('underscore');
var util = require('util');

var apnConnection = new apn.Connection({
  cert: process.env.APNS_CERT,
  key: process.env.APNS_PRIVATE_KEY,
  gateway: process.env.APNS_SERVER,
  errorCallback: function(errNum, n) { console.log(errNum); }
});

exports.registerToken = function(req, res) {
  User.findOne({ '_id' : req.user.id }, function(err, wizard) {
    //wizard.apnTokens.push(req.param('token'));
    wizard.apnToken = req.param('token');
    wizard.save(function(err) {
      if (err) {
        res.json({ 
          'status' : { 'name' : 'TokenDatabaseError', 'message' : 'Could not save token to the database.' },
        });
      }
      else {
        res.json({ 
          'status' : { 'name' : 'Success', 'message' : 'Token successfully registered.' },
        });
      }
    });
  });
}

exports.sendAPN = function(sourceWizard, targetWizard) {
  console.log("sendAPN");
  if (targetWizard.apnToken !== null && targetWizard.apnToken != '' && targetWizard.apnToken != undefined) {
      var token = targetWizard.apnToken;
      console.log(token);

    //_.each(targetWizard.apnTokens, function(token) {
      var device = new apn.Device(token);
      
      var note = new apn.Notification();
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 1;
      note.sound = 'ping.aiff';
      note.alert = util.format('%s has cast a glitch on you!', sourceWizard.username);
      note.payload = {'messageFrom': sourceWizard.username };

      apnConnection.pushNotification(note, device);
    //});
    }
}
