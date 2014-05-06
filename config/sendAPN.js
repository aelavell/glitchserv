var apn = require('apn');

var apnConnection = new apn.Connection({
  cert: process.env.APNS_CERT,
  key: process.env.APNS_PRIVATE_KEY,
  gateway: 'gateway.sandbox.push.apple.com',
  errorCallback: function(errNum, n) { console.log(errNum); }
});


module.exports = function(token) {
  var device = new apn.Device(token);
  
  var note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.badge = 420;
  note.sound = "ping.aiff";
  note.alert = "\uD83D\uDCE7 \u2709 You have been GLITCHxxED";
  note.payload = {'messageFrom': 'yolomaester'};

  apnConnection.pushNotification(note, device);
}
