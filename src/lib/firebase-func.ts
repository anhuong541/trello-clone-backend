import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "../db/firebase";

export const checkEmailUIDExists = async (uid: string) => {
  const userRef = await getDoc(doc(firestoreDB, `users`, uid));
  return userRef.exists();
};
