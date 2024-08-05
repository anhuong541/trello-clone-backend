import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Firebase setup
const serviceAccount = require(process.env
  .FIREBASE_SERVICE_ACCOUNT_KEY_PATH as string);

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const firebaseDB = admin.database(firebaseApp);
export const firebaseAuth = admin.auth(firebaseApp);
