const admin = require('firebase-admin');
const functions = require('firebase-functions');
const createUser = require('./Create_User');
const reqestOneTimePassword = require('./Request_One_Time_Password');
const serviceAccount = require("./API/apiFirebaseFunction.json");
const verifyOneTimePassword = require('./Verify_One_Time_Password');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://weather-forecast-9a2a5.firebaseio.com"
});

exports.createUser = functions.https.onRequest(createUser);
exports.requestTimePassword = functions.https.onRequest(reqestOneTimePassword);
exports.verifyOneTimePassword = functions.https.onRequest(verifyOneTimePassword);