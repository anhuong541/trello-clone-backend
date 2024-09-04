"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProjectInfoHandler;
const tslib_1 = require("tslib");
const firebase_func_1 = require("./../../../lib/firebase-func");
function ProjectInfoHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const feat = "project info";
        const { projectId } = req.params;
        try {
            const data = yield (0, firebase_func_1.getProjectInfo)(projectId);
            const membersRes = yield (0, firebase_func_1.viewMemberInProject)(projectId);
            const members = membersRes.docs.map((item) => {
                return Object.assign(Object.assign({}, item.data()), { user: item.id });
            });
            return res.status(200).json({
                status: "success",
                feat,
                data: Object.assign(Object.assign({}, data), { members }),
            });
        }
        catch (error) {
            return res.status(400).json({
                status: "fail",
                feat,
                error,
            });
        }
    });
}
//# sourceMappingURL=index.js.map