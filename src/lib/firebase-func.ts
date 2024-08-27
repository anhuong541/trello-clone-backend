import { doc, getDoc, setDoc, deleteDoc, getDocs, collection, DocumentData, updateDoc } from "firebase/firestore";
import { AuthorityType, DataUserProject, NewDataProject } from "@/types";
import { DataRegister, DataTask } from "@/types/firebase";
import { firestoreDB } from "@/db/firebase";

// user
export const checkEmailUIDExists = async (uid: string) => {
  try {
    return (await getDoc(doc(firestoreDB, `users`, uid))).exists();
  } catch (error) {
    console.log("this is the error: ", error);
    return null;
  }
};

export const checkUserAccountIsActive = async (uid: string) => {
  try {
    const userData = (await getDoc(doc(firestoreDB, `users`, uid))).data();
    if (userData?.isActive) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("this is the error: ", error);
    return null;
  }
};

export const deleteAccountUnActive = async (userId: string) => {
  try {
    return await deleteDoc(doc(firestoreDB, `users`, userId));
  } catch (error) {
    console.log("error when delete user: ", error);
    return null;
  }
};

export const checkProjectExists = async (projectId: string) => {
  return (await getDoc(doc(firestoreDB, "projects", projectId))).exists();
};

export const getUserDataById = async (uid: string) => {
  return (await getDoc(doc(firestoreDB, `users`, uid))).data();
};

export const createNewUser = async (uid: string, data: DataRegister) => {
  return await setDoc(doc(firestoreDB, "users", uid), data);
};

export const addUserProjectsInfo = async (uid: string, projectId: string, data: DataUserProject) => {
  return await setDoc(doc(firestoreDB, "users", uid, "projects", projectId), data);
};

//project
export const createOrSetProject = async (projectId: string, data: NewDataProject) => {
  return await setDoc(doc(firestoreDB, "projects", projectId), data);
};

export const deteleProject = async (uid: string, projectId: string) => {
  await deleteDoc(doc(firestoreDB, "users", uid, "projects", projectId));
  await deleteDoc(doc(firestoreDB, "projects", projectId));
  await deleteDoc(doc(firestoreDB, "projects", projectId, "authority", uid));
};

export const getProjectInfo = async (projectId: string) => {
  return (await getDoc(doc(firestoreDB, "projects", projectId))).data();
};

export const checkUserAuthority = async (projectId: string, userId: string) => {
  return (await getDoc(doc(firestoreDB, "projects", projectId, "authority", userId))).data();
};

export const getProjectListByUser = async (uid: string) => {
  const listProjectRef = await getDocs(collection(firestoreDB, "users", uid, "projects"));
  return listProjectRef.docs.map((item: DocumentData) => item.data());
};

export const getUpdateProjectDueTime = async (projectId: string) => {
  await updateDoc(doc(firestoreDB, "projects", projectId), {
    dueTime: Date.now(),
  });
};

// task feature
export const createOrSetTask = async (projectId: string, taskId: string, contentTask: DataTask) => {
  return await setDoc(doc(firestoreDB, "projects", projectId, "tasks", taskId), contentTask);
};

export const viewTasksProject = async (projectId: string) => {
  return (await getDocs(collection(firestoreDB, "projects", projectId, "tasks"))).docs.map((item: DocumentData) => item.data());
};

export const deteleTask = async (projectId: string, taskId: string) => {
  return await deleteDoc(doc(firestoreDB, "projects", projectId, "tasks", taskId));
};

// member
export const addMemberAuthorityInProject = async (projectId: string, userId: string, authority: AuthorityType[]) => {
  return await setDoc(doc(firestoreDB, "projects", projectId, "authority", userId), { authority });
};

export const updateMemberInProject = async (memberId: string, projectId: string, members: string[]) => {
  return await updateDoc(doc(firestoreDB, "projects", projectId), { members: [...members, memberId] });
};

export const addProjectIntoMemberData = async (memberId: string, projectId: string) => {
  const projectInfo = await getProjectInfo(projectId);
  let input = projectInfo;
  delete input.members;

  await setDoc(doc(firestoreDB, "users", memberId, "projects", projectId), input);
  await updateDoc(doc(firestoreDB, "projects", projectId), { members: [...projectInfo.members, memberId] });
};

export const viewMemberInProject = async (projectId: string) => {
  return await getDocs(collection(firestoreDB, "projects", projectId, "authority"));
};

export const updateMemberAuthorityInProject = async (projectId: string, userId: string, authority: AuthorityType[]) => {
  await updateDoc(doc(firestoreDB, "projects", projectId, "authority", userId), { authority });
};

export const removeMemberOutOfProject = async (projectId: string, memberId: string) => {
  const projectInfo = await getProjectInfo(projectId);

  await deleteDoc(doc(firestoreDB, "projects", projectId, "authority", memberId));

  const removedMemberArr = projectInfo.members.filter((item) => item !== memberId);
  await updateDoc(doc(firestoreDB, "projects", projectId), {
    members: [...removedMemberArr],
  });

  await deleteDoc(doc(firestoreDB, "users", memberId, "projects", projectId));
};
