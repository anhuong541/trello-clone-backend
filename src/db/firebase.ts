import admin from "firebase-admin";

// Firebase setup
const serviceAccount = require(process.env
  .FIREBASE_SERVICE_ACCOUNT_KEY as string);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firebaseDB = admin.firestore();
export const auth = admin.auth();
