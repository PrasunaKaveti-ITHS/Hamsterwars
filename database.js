const admin = require("firebase-admin");

let serviceAccount;
if(process.env.PRIVATE_KEY){
  // på Heroku
   serviceAccount = JSON.parse(process.env.PRIVATE_KEY)
}else{
  //lokalt på min dator
  serviceAccount = require("./hamsterwars-firebase-private-key.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getDatabase() {
	return admin.firestore()
}

module.exports = getDatabase