"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ViewMemberHandler;
const tslib_1 = require("tslib");
const firebase_func_1 = require("@/lib/firebase-func");
function ViewMemberHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const feat = "view member auth";
        const projectId = (_b = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.projectId) !== null && _b !== void 0 ? _b : "";
        try {
            const listMember = yield (0, firebase_func_1.viewMemberInProject)(projectId);
            return res.status(200).json({ status: "success", feat, listMember });
        }
        catch (error) {
            return res.status(400).json({ status: "fail", feat, message: "Something wrong happen to this api" });
        }
    });
}
//# sourceMappingURL=index.js.map