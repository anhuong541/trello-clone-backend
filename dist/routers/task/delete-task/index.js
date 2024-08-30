"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteTaskHandler;
const tslib_1 = require("tslib");
const utils_1 = require("@/lib/utils");
const firebase_func_1 = require("@/lib/firebase-func");
const auth_action_1 = require("@/lib/auth-action");
const socket_1 = require("@/lib/socket");
// import { io } from "@/ws";
function DeleteTaskHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const feat = "delete task";
        const taskContent = req.params;
        try {
            const userId = (0, utils_1.readUserIdFromTheCookis)(req);
            if (!taskContent) {
                return res.status(400).json({
                    status: "fail",
                    message: "require task body",
                    feat,
                });
            }
            const check = yield (0, auth_action_1.checkUserIsAllowJoiningProject)(userId, taskContent.projectId);
            if (!check) {
                return res.status(401).json({
                    message: "User is not allow on this room",
                    userAuthority: check,
                    feat,
                });
            }
            try {
                yield (0, firebase_func_1.deteleTask)(taskContent.projectId, taskContent.taskId);
                yield (0, firebase_func_1.getUpdateProjectDueTime)(taskContent.projectId);
                const dataTableAfterUpdate = yield (0, firebase_func_1.viewTasksProject)(taskContent.projectId);
                // io.to(taskContent.projectId).emit("view_project", dataTableAfterUpdate);
                socket_1.socket.emit("call_update_project", taskContent.projectId, dataTableAfterUpdate);
                return res.status(200).json({ status: "success", feat });
            }
            catch (error) {
                return res.status(400).json({
                    status: "fail",
                    feat,
                    message: "something wrong when delete task",
                    error,
                });
            }
        }
        catch (error) {
            return res.status(401).json({ status: "fail", feat, message: "Un Authorization" });
        }
    });
}
//# sourceMappingURL=index.js.map