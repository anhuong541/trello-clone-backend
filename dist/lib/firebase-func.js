"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMemberOutOfProject = exports.updateMemberAuthorityInProject = exports.viewMemberInProject = exports.addProjectIntoMemberData = exports.addMemberAuthorityInProject = exports.deteleTask = exports.viewTasksProject = exports.createOrSetTask = exports.getUpdateProjectDueTime = exports.getProjectListByUser = exports.checkUserAuthority = exports.getProjectInfo = exports.deteleProject = exports.createOrSetProject = exports.addUserProjectsInfo = exports.createNewUser = exports.getUserDataById = exports.checkProjectExists = exports.deleteAccountUnActive = exports.checkUserAccountIsActive = exports.checkEmailUIDExists = void 0;
const tslib_1 = require("tslib");
const firebase_1 = require("../db/firebase"); // Admin SDK instance
// user
const checkEmailUIDExists = (uid) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const docRef = firebase_1.firestore.collection("users").doc(uid);
        const docSnapshot = yield docRef.get();
        return docSnapshot.exists;
    }
    catch (error) {
        console.error("this is the error: ", error);
        return null;
    }
});
exports.checkEmailUIDExists = checkEmailUIDExists;
const checkUserAccountIsActive = (uid) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = (yield firebase_1.firestore.collection("users").doc(uid).get()).data();
        return (userData === null || userData === void 0 ? void 0 : userData.isActive) || false;
    }
    catch (error) {
        console.error("this is the error: ", error);
        return null;
    }
});
exports.checkUserAccountIsActive = checkUserAccountIsActive;
const deleteAccountUnActive = (userId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        yield firebase_1.firestore.collection("users").doc(userId).delete();
        return true;
    }
    catch (error) {
        console.error("error when delete user: ", error);
        return null;
    }
});
exports.deleteAccountUnActive = deleteAccountUnActive;
const checkProjectExists = (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const docSnapshot = yield firebase_1.firestore.collection("projects").doc(projectId).get();
    return docSnapshot.exists;
});
exports.checkProjectExists = checkProjectExists;
const getUserDataById = (uid) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const docSnapshot = yield firebase_1.firestore.collection("users").doc(uid).get();
    return docSnapshot.data();
});
exports.getUserDataById = getUserDataById;
const createNewUser = (uid, data) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firestore.collection("users").doc(uid).set(data);
});
exports.createNewUser = createNewUser;
const addUserProjectsInfo = (uid, projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firestore.collection("users").doc(uid).collection("projects").doc(projectId).set({ projectId });
});
exports.addUserProjectsInfo = addUserProjectsInfo;
// project
const createOrSetProject = (projectId, data) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firestore.collection("projects").doc(projectId).set(data);
});
exports.createOrSetProject = createOrSetProject;
function deleteMemberList(projectId) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const authorityCol = firebase_1.firestore.collection("projects").doc(projectId).collection("authority");
        const querySnapshot = yield authorityCol.get();
        yield Promise.all(querySnapshot.docs.map((item) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield firebase_1.firestore.collection("projects").doc(projectId).collection("authority").doc(item.id).delete();
            yield firebase_1.firestore.collection("users").doc(item.id).collection("projects").doc(projectId).delete();
        })));
    });
}
const deteleProject = (uid, projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        firebase_1.firestore.collection("projects").doc(projectId).delete(),
        firebase_1.firestore.collection("users").doc(uid).collection("projects").doc(projectId).delete(),
        deleteMemberList(projectId),
    ]);
});
exports.deteleProject = deteleProject;
const getProjectInfo = (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const docSnapshot = yield firebase_1.firestore.collection("projects").doc(projectId).get();
    return docSnapshot.data();
});
exports.getProjectInfo = getProjectInfo;
const checkUserAuthority = (projectId, userId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const docSnapshot = yield firebase_1.firestore.collection("projects").doc(projectId).collection("authority").doc(userId).get();
    return docSnapshot.data();
});
exports.checkUserAuthority = checkUserAuthority;
const getProjectListByUser = (uid) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const projectSnapshot = yield firebase_1.firestore.collection("users").doc(uid).collection("projects").get();
    const projectIds = projectSnapshot.docs.map((doc) => doc.id);
    return yield Promise.all(projectIds.map((projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const projectData = yield firebase_1.firestore.collection("projects").doc(projectId).get();
        return projectData.data();
    })));
});
exports.getProjectListByUser = getProjectListByUser;
const getUpdateProjectDueTime = (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firestore.collection("projects").doc(projectId).update({
        dueTime: Date.now(),
    });
});
exports.getUpdateProjectDueTime = getUpdateProjectDueTime;
// task feature
const createOrSetTask = (projectId, taskId, contentTask) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firestore.collection("projects").doc(projectId).collection("tasks").doc(taskId).set(contentTask);
});
exports.createOrSetTask = createOrSetTask;
const viewTasksProject = (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const tasksSnapshot = yield firebase_1.firestore.collection("projects").doc(projectId).collection("tasks").get();
    return tasksSnapshot.docs.map((doc) => doc.data());
});
exports.viewTasksProject = viewTasksProject;
const deteleTask = (projectId, taskId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firestore.collection("projects").doc(projectId).collection("tasks").doc(taskId).delete();
});
exports.deteleTask = deteleTask;
// member
const addMemberAuthorityInProject = (projectId, userId, authority) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firestore.collection("projects").doc(projectId).collection("authority").doc(userId).set({ authority });
});
exports.addMemberAuthorityInProject = addMemberAuthorityInProject;
const addProjectIntoMemberData = (memberId, projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const projectInfo = yield (0, exports.getProjectInfo)(projectId);
    const _a = projectInfo || {}, { members } = _a, dataWithoutMembers = tslib_1.__rest(_a, ["members"]);
    yield firebase_1.firestore.collection("users").doc(memberId).collection("projects").doc(projectId).set(dataWithoutMembers);
});
exports.addProjectIntoMemberData = addProjectIntoMemberData;
const viewMemberInProject = (projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return yield firebase_1.firestore.collection("projects").doc(projectId).collection("authority").get();
});
exports.viewMemberInProject = viewMemberInProject;
const updateMemberAuthorityInProject = (projectId, userId, authority) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield firebase_1.firestore.collection("projects").doc(projectId).collection("authority").doc(userId).update({ authority });
});
exports.updateMemberAuthorityInProject = updateMemberAuthorityInProject;
const removeMemberOutOfProject = (projectId, memberId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        firebase_1.firestore.collection("projects").doc(projectId).collection("authority").doc(memberId).delete(),
        firebase_1.firestore.collection("users").doc(memberId).collection("projects").doc(projectId).delete(),
    ]);
});
exports.removeMemberOutOfProject = removeMemberOutOfProject;
//# sourceMappingURL=firebase-func.js.map