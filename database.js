var admin = require("firebase-admin");

var serviceAccount = require("./hamsterwars-firebase-private-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getDatabase() {
	return admin.firestore()
}

module.exports = getDatabase