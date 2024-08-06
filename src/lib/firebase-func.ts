import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  DocumentData,
} from "firebase/firestore";
import { firestoreDB } from "../db/firebase";

type DataRegister = {
  uid: string;
  username: string;
  email: string;
  password: string;
  createAt: number;
  jwtToken: string;
};

type DataProject = {
  projectId: string;
  projectName: string;
};

export const checkEmailUIDExists = async (uid: string) => {
  return (await getDoc(doc(firestoreDB, `users`, uid))).exists();
};

export const checkProjectExists = async (uid: string, projectId: string) => {
  return (
    await getDoc(doc(firestoreDB, `users`, uid, "projects", projectId))
  ).exists();
};

export const checkJWTTokenExpire = async (jwtToken: string) => {
  return (
    await getDoc(doc(firestoreDB, `jwt_tokens_expire`, jwtToken))
  ).exists();
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

export const createOrSetProject = async (
  uid: string,
  projectId: string,
  data: DataProject
) => {
  return await setDoc(
    doc(firestoreDB, "users", uid, "projects", projectId),
    data
  );
};

export const deteleProject = async (uid: string, projectId: string) => {
  return await deleteDoc(doc(firestoreDB, "users", uid, "projects", projectId));
};

export const getProjectInfo = async (uid: string, projectId: string) => {
  return (
    await getDoc(doc(firestoreDB, `users`, uid, "projects", projectId))
  ).data();
};

export const getProjectListByUser = async (uid: string) => {
  const listProjectRef = await getDocs(
    collection(firestoreDB, "users", uid, "projects")
  );
  return listProjectRef.docs.map((item: DocumentData) => item.data());
};
