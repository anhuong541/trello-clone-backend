import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { firestoreDB } from "../db/firebase";

type DataRegister = {
  uid: string;
  username: string;
  email: string;
  password: string;
  createAt: number;
  jwtToken: string;
};

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

export const getUserDataById = async (uid: string) => {
  return (await getDoc(doc(firestoreDB, `users`, uid))).data();
};

export const createNewUser = async (uid: string, data: DataRegister) => {
  return await setDoc(doc(firestoreDB, "users", uid), data);
};

export const createProject = async () => {};
