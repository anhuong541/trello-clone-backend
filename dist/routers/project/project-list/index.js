"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProjectListHandler;
const tslib_1 = require("tslib");
const firebase_func_1 = require("./../../../lib/firebase-func");
const utils_1 = require("./../../../lib/utils");
function ProjectListHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const feat = "project list";
        let userId = "";
        try {
            userId = (0, utils_1.readUserIdFromTheCookis)(req);
        }
        catch (error) {
            return res.status(401).json({ status: "fail", feat, message: "Un Authorization" });
        }
        try {
            const data = yield (0, firebase_func_1.getProjectListByUser)(userId);
            return res.status(200).json({
                status: "success",
                feat,
                data,
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