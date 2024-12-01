import { AuthorityType, NewDataProject } from "../types";
import { DataRegister, DataTask } from "../types/firebase";
import { firestore } from "../db/firebase"; // Admin SDK instance

// user
export const checkEmailUIDExists = async (uid: string) => {
  try {
    const docRef = firestore.collection("users").doc(uid);
    const docSnapshot = await docRef.get();
    return docSnapshot.exists;
  } catch (error) {
    console.error("this is the error: ", error);
    return null;
  }
};

export const checkUserAccountIsActive = async (uid: string) => {
  try {
    const userData = (await firestore.collection("users").doc(uid).get()).data();
    return userData?.isActive || false;
  } catch (error) {
    console.error("this is the error: ", error);
    return null;
  }
};

export const deleteAccountUnActive = async (userId: string) => {
  try {
    await firestore.collection("users").doc(userId).delete();
    return true;
  } catch (error) {
    console.error("error when delete user: ", error);
    return null;
  }
};

export const checkProjectExists = async (projectId: string) => {
  const docSnapshot = await firestore.collection("projects").doc(projectId).get();
  return docSnapshot.exists;
};

export const getUserDataById = async (uid: string) => {
  const docSnapshot = await firestore.collection("users").doc(uid).get();
  return docSnapshot.data();
};

export const createNewUser = async (uid: string, data: DataRegister) => {
  await firestore.collection("users").doc(uid).set(data);
};

export const addUserProjectsInfo = async (uid: string, projectId: string) => {
  await firestore.collection("users").doc(uid).collection("projects").doc(projectId).set({ projectId });
};

// project
export const createOrSetProject = async (projectId: string, data: NewDataProject) => {
  await firestore.collection("projects").doc(projectId).set(data);
};

async function deleteMemberList(projectId: string) {
  const authorityCol = firestore.collection("projects").doc(projectId).collection("authority");
  const querySnapshot = await authorityCol.get();

  await Promise.all(
    querySnapshot.docs.map(async (item) => {
      await firestore.collection("projects").doc(projectId).collection("authority").doc(item.id).delete();
      await firestore.collection("users").doc(item.id).collection("projects").doc(projectId).delete();
    })
  );
}

export const deteleProject = async (uid: string, projectId: string) => {
  await Promise.all([
    firestore.collection("projects").doc(projectId).delete(),
    firestore.collection("users").doc(uid).collection("projects").doc(projectId).delete(),
    deleteMemberList(projectId),
  ]);
};

export const getProjectInfo = async (projectId: string) => {
  const docSnapshot = await firestore.collection("projects").doc(projectId).get();
  return docSnapshot.data();
};

export const checkUserAuthority = async (projectId: string, userId: string) => {
  const docSnapshot = await firestore.collection("projects").doc(projectId).collection("authority").doc(userId).get();
  return docSnapshot.data();
};

export const getProjectListByUser = async (uid: string) => {
  const projectSnapshot = await firestore.collection("users").doc(uid).collection("projects").get();
  const projectIds = projectSnapshot.docs.map((doc) => doc.id);

  return await Promise.all(
    projectIds.map(async (projectId) => {
      const projectData = await firestore.collection("projects").doc(projectId).get();
      return projectData.data();
    })
  );
};

export const getUpdateProjectDueTime = async (projectId: string) => {
  await firestore.collection("projects").doc(projectId).update({
    dueTime: Date.now(),
  });
};

// task feature
export const createOrSetTask = async (projectId: string, taskId: string, contentTask: DataTask) => {
  await firestore.collection("projects").doc(projectId).collection("tasks").doc(taskId).set(contentTask);
};

export const viewTasksProject = async (projectId: string) => {
  const tasksSnapshot = await firestore.collection("projects").doc(projectId).collection("tasks").get();
  return tasksSnapshot.docs.map((doc) => doc.data());
};

export const deteleTask = async (projectId: string, taskId: string) => {
  await firestore.collection("projects").doc(projectId).collection("tasks").doc(taskId).delete();
};

// member
export const addMemberAuthorityInProject = async (projectId: string, userId: string, authority: AuthorityType[]) => {
  await firestore.collection("projects").doc(projectId).collection("authority").doc(userId).set({ authority });
};

export const addProjectIntoMemberData = async (memberId: string, projectId: string) => {
  const projectInfo = await getProjectInfo(projectId);
  const { members, ...dataWithoutMembers } = projectInfo || {};
  await firestore.collection("users").doc(memberId).collection("projects").doc(projectId).set(dataWithoutMembers);
};

export const viewMemberInProject = async (projectId: string) => {
  return await firestore.collection("projects").doc(projectId).collection("authority").get();
};

export const updateMemberAuthorityInProject = async (projectId: string, userId: string, authority: AuthorityType[]) => {
  await firestore.collection("projects").doc(projectId).collection("authority").doc(userId).update({ authority });
};

export const removeMemberOutOfProject = async (projectId: string, memberId: string) => {
  await Promise.all([
    firestore.collection("projects").doc(projectId).collection("authority").doc(memberId).delete(),
    firestore.collection("users").doc(memberId).collection("projects").doc(projectId).delete(),
  ]);
};
