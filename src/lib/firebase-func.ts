import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { firestoreDB } from "../db/firebase";

export const checkEmailUIDExists = async (uid: string) => {
  const userRef = await getDoc(doc(firestoreDB, `users`, uid));
  return userRef.exists();
};

export const checkJWTTokenExpire = async (jwtToken: string) => {
  const ref = await getDoc(doc(firestoreDB, `jwt_tokens_expire`, jwtToken));
  return ref.exists();
};

export const addJWTTokenExpire = async (jwtToken: string) => {
  await setDoc(doc(firestoreDB, "jwt_tokens_expire", jwtToken), {
    jwtToken,
  });
};
