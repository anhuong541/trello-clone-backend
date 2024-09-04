"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JoinProjectRoomHandler;
const tslib_1 = require("tslib");
const auth_action_1 = require("./../lib/auth-action");
const firebase_func_1 = require("./../lib/firebase-func");
const socket_1 = require("./../lib/socket");
const utils_1 = require("./../lib/utils");
function JoinProjectRoomHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const projectId = (_b = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.projectId) !== null && _b !== void 0 ? _b : "";
        const userId = (0, utils_1.readUserIdFromTheCookis)(req);
        const check = yield (0, auth_action_1.checkUserIsAllowJoiningProject)(userId, projectId);
        if (check) {
            const data = yield (0, firebase_func_1.viewTasksProject)(projectId);
            yield socket_1.ablyRealtime.channels.get(`view_project_${projectId}`).publish({ data });
        }
        else {
            yield socket_1.ablyRealtime.channels
                .get(`view_project_${projectId}`)
                .publish({ data: { error: "User didn't allow to join this project", status: "fail" } });
        }
        return res.status(200).send({ any: "asfnaosjnfoan" });
    });
}
//# sourceMappingURL=join-project-room.js.map