var apn = require('apn');
var User = require('../app/models/user');
var _ = require('underscore');

var apnConnection = new apn.Connection({
  cert: process.env.APNS_CERT,
  key: process.env.APNS_PRIVATE_KEY,
  gateway: 'gateway.sandbox.push.apple.com',
  errorCallback: function(errNum, n) { console.log(errNum); }
});

exports.registerToken = function(req, res) {
  User.findOne({ '_id' : req.user.id }, function(err, wizard) {
    //wizard.apnTokens.push(req.param('token'));
    wizard.apnToken = req.param('token');
    res.json({ 
      'status' : { 'name' : 'Success', 'message' : 'Token successfully registered.' },
    });
  });
}

exports.sendAPN = function(sourceWizard, targetWizard) {
  if (targetWizard.apnToken !== null && targetWizard.apnToken != '') {
    try {
      var token = targetWizard.apnToken;
    //_.each(targetWizard.apnTokens, function(token) {
      var device = new apn.Device(token);
      
      var note = new apn.Notification();
      note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      note.badge = 420;
      note.sound = 'ping.aiff';
      note.alert = util.format('%s has cast a glitch on you!', sourceWizard.username);
      note.payload = {'messageFrom': sourceWizard.username };

      apnConnection.pushNotification(note, device);
    //});
    }
    catch(e) {}
  }
}
