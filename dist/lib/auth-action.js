"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserIsProjectOwner = exports.authUserIsAMember = exports.checkUserIsAllowJoiningProject = exports.authorizationMidleware = exports.sendUserSession = void 0;
const tslib_1 = require("tslib");
const config_1 = tslib_1.__importDefault(require("@/config"));
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
const utils_1 = require("./utils");
const firebase_1 = require("@/db/firebase");
const firestore_1 = require("firebase/firestore");
const firebase_func_1 = require("./firebase-func");
const sendUserSession = (res, token) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    yield res.cookie("user_session", token, {
        httpOnly: true, // for deploy only
        secure: config_1.default.env,
        maxAge: 2 * 60 * 60 * 1000, // two hours
        path: "/",
    });
});
exports.sendUserSession = sendUserSession;
const authorizationMidleware = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const feat = "check authorization";
    const token = (_a = req === null || req === void 0 ? void 0 : req.cookies.user_session) !== null && _a !== void 0 ? _a : "";
    try {
        jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
        return next();
    }
    catch (error) {
        return res.status(401).json({ status: "fail", feat, message: "Un Authorization" });
    }
});
exports.authorizationMidleware = authorizationMidleware;
const checkUserIsAllowJoiningProject = (userId, projectId) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.firestoreDB, `users`, userId, "projects", projectId))).exists();
});
exports.checkUserIsAllowJoiningProject = checkUserIsAllowJoiningProject;
const authUserIsAMember = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const feat = "check user is a member";
    const taskContent = req.body;
    const userId = (0, utils_1.readUserIdFromTheCookis)(req);
    try {
        const check = yield (0, exports.checkUserIsAllowJoiningProject)(userId, taskContent.projectId);
        if (check) {
            return next();
        }
        return res.status(401).json({
            message: "User is not allow on this room",
            userAuthority: check,
            feat,
        });
    }
    catch (error) {
        return res.status(404).json({
            status: "fail",
            feat,
            message: "Check user auth got something wrong",
        });
    }
});
exports.authUserIsAMember = authUserIsAMember;
const authUserIsProjectOwner = (req, res, next) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const feat = "check user is a project owner";
    const projectId = req.params.projectId;
    const userId = (0, utils_1.readUserIdFromTheCookis)(req);
    try {
        const { authority } = yield (0, firebase_func_1.checkUserAuthority)(projectId, userId);
        if (authority.includes("Owner")) {
            return next();
        }
        return res.status(401).json({
            status: "success",
            message: "User did not have authority of Owner",
            feat,
        });
    }
    catch (error) {
        return res.status(404).json({
            status: "fail",
            feat,
            message: "Check user auth got something wrong",
        });
    }
});
exports.authUserIsProjectOwner = authUserIsProjectOwner;
//# sourceMappingURL=auth-action.js.map