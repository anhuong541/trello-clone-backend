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
import { DataProject, DataRegister, DataTask } from "../types/firebase";

// user
export const checkEmailUIDExists = async (uid: string) => {
  try {
    return (await getDoc(doc(firestoreDB, `users`, uid))).exists();
  } catch (error) {
    console.log("this is the error: ", error);
  }
};

export const checkProjectExists = async (uid: string, projectId: string) => {
  return (
    await getDoc(doc(firestoreDB, `users`, uid, "projects", projectId))
  ).exists();
};

export const getUserDataById = async (uid: string) => {
  return (await getDoc(doc(firestoreDB, `users`, uid))).data();
};

export const createNewUser = async (uid: string, data: DataRegister) => {
  return await setDoc(doc(firestoreDB, "users", uid), data);
};

//project
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

// task feature
export const createOrSetTask = async (
  uid: string,
  projectId: string,
  taskId: string,
  contentTask: DataTask
) => {
  return await setDoc(
    doc(firestoreDB, "users", uid, "projects", projectId, "tasks", taskId),
    contentTask
  );
};

export const viewTasksProject = async (uid: string, projectId: string) => {
  return (
    await getDocs(
      collection(firestoreDB, "users", uid, "projects", projectId, "tasks")
    )
  ).docs.map((item: DocumentData) => item.data());
};
