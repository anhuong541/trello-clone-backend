"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firestore = void 0;
const tslib_1 = require("tslib");
const firebase_admin_1 = tslib_1.__importDefault(require("firebase-admin"));
const constant_1 = require("../../constant");
const serviceAccountKeys = require(constant_1.GOOGLE_APPLICATION_CREDENTIALS);
// admin firebase
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccountKeys),
    databaseURL: "https://trello-clone-v2-78290-default-rtdb.asia-southeast1.firebasedatabase.app",
});
exports.firestore = firebase_admin_1.default.firestore();
// using admin firebase only
// import { getFirestore } from "firebase/firestore";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { firebaseConfigClone } from "../../config/clone-db";
// import config from "./../../config";
// const firebaseConfig = {
//   apiKey: config.apiKey,
//   authDomain: config.authDomain,
//   projectId: config.projectId,
//   storageBucket: config.storageBucket,
//   messagingSenderId: config.messagingSenderId,
//   appId: config.appId,
//   measurementId: config.measurementId,
// };
// // const firebaseApp = initializeApp(config.env ? firebaseConfig : firebaseConfigClone);
// const firebaseApp = initializeApp(firebaseConfig);
// export const auth = getAuth(firebaseApp);
// export const firestoreDB = getFirestore(firebaseApp);
//# sourceMappingURL=index.js.map