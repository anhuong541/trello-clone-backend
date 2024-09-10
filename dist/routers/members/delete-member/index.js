"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteMemberHandler;
const tslib_1 = require("tslib");
const socket_1 = require("../../../lib/socket");
const firebase_func_1 = require("../../../lib/firebase-func");
const utils_1 = require("../../../lib/utils");
function DeleteMemberHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const feat = "remove member auth";
        const userId = (0, utils_1.readUserIdFromTheCookis)(req);
        const { email, projectId } = req === null || req === void 0 ? void 0 : req.params;
        const memberUserId = (0, utils_1.generateUidByString)(email);
        if (memberUserId === userId) {
            return res.status(409).json({
                status: "fail",
                error: "user is deleting them self!",
                feat,
            });
        }
        if (!(yield (0, firebase_func_1.checkEmailUIDExists)(memberUserId))) {
            return res.status(409).json({
                status: "fail",
                error: "This member doesn't exists!",
                feat,
            });
        }
        try {
            const { authority } = yield (0, firebase_func_1.checkUserAuthority)(projectId, userId);
            if (!authority.includes("Owner")) {
                return res.status(401).json({ status: "fail", feat, message: "User don't have this authority" });
            }
            yield (0, firebase_func_1.removeMemberOutOfProject)(projectId, memberUserId);
            const dataTableAfterUpdate = yield (0, firebase_func_1.viewTasksProject)(projectId);
            socket_1.ablyRealtime.channels.get(`view_project_${projectId}`).publish({ data: dataTableAfterUpdate });
            return res.status(200).json({ status: "success", feat, message: "Delete success" });
        }
        catch (error) {
            return res.status(400).json({ status: "fail", feat, message: "Something wrong happen to this api" });
        }
    });
}
//# sourceMappingURL=index.js.map