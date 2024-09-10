"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditMemberHandler;
const tslib_1 = require("tslib");
const firebase_func_1 = require("../../../lib/firebase-func");
const utils_1 = require("../../../lib/utils");
function EditMemberHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const feat = "edit member auth";
        const userId = (0, utils_1.readUserIdFromTheCookis)(req);
        const { email, memberAuthority } = req === null || req === void 0 ? void 0 : req.body;
        const projectId = (_b = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.projectId) !== null && _b !== void 0 ? _b : "";
        if (memberAuthority.includes("Owner")) {
            return res.status(403).json({ status: "fail", feat, message: "Only project creator can be the Owner" });
        }
        const memberUserId = (0, utils_1.generateUidByString)(email);
        if (memberUserId === userId) {
            return res.status(409).json({
                status: "fail",
                error: "user is editting them self!",
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
            yield (0, firebase_func_1.updateMemberAuthorityInProject)(projectId, memberUserId, memberAuthority);
            return res.status(200).json({ status: "success", feat, message: "Edit success" });
        }
        catch (error) {
            return res.status(400).json({ status: "fail", feat, message: "Something wrong happen to this api" });
        }
    });
}
//# sourceMappingURL=index.js.map