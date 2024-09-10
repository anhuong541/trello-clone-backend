"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = UpdateTaskHandler;
const tslib_1 = require("tslib");
const firebase_func_1 = require("./../../../lib/firebase-func");
function UpdateTaskHandler(req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const feat = "update task";
        const taskContent = req.body;
        try {
            if (!taskContent) {
                return res.status(400).json({
                    status: "fail",
                    message: "require task body",
                    feat,
                });
            }
            if (!(yield (0, firebase_func_1.checkProjectExists)(taskContent.projectId))) {
                return res.status(409).json({ status: "fail", error: "project doesn't exists!", feat });
            }
            try {
                yield (0, firebase_func_1.createOrSetTask)(taskContent.projectId, taskContent.taskId, taskContent);
                yield (0, firebase_func_1.getUpdateProjectDueTime)(taskContent.projectId);
                const dataTableBeforeUpdate = yield (0, firebase_func_1.viewTasksProject)(taskContent.projectId);
                console.log({ dataTableBeforeUpdate });
                // const updateIndexAfterUpdate = dataTableBeforeUpdate.filter((item) => item.taskStatus === taskContent.taskStatus).sort;
                // ablyRealtime.channels.get(`view_project_${taskContent.projectId}`).publish({ data: handleFormatDataBoard(dataTableBeforeUpdate) });
                return res.status(200).json({ status: "success", feat });
            }
            catch (error) {
                return res.status(400).json({
                    status: "fail",
                    feat,
                    message: "something wrong when update task",
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