import { checkProjectExists, createOrSetTask, getUpdateProjectDueTime, viewTasksProject } from "../../../lib/firebase-func";
// import { handleFormatDataBoard } from "../../../lib/utils";
// import { ablyRealtime } from "../../../lib/socket";
import { TaskType } from "../../../types";
import { Request, Response } from "express";

export default async function UpdateTaskHandler(req: Request<{}, {}, TaskType, {}>, res: Response) {
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

    if (!(await checkProjectExists(taskContent.projectId))) {
      return res.status(409).json({ status: "fail", error: "project doesn't exists!", feat });
    }

    try {
      await createOrSetTask(taskContent.projectId, taskContent.taskId, taskContent);
      await getUpdateProjectDueTime(taskContent.projectId);
      const dataTableBeforeUpdate = await viewTasksProject(taskContent.projectId);

      console.log({ dataTableBeforeUpdate });

      // const updateIndexAfterUpdate = dataTableBeforeUpdate.filter((item) => item.taskStatus === taskContent.taskStatus).sort;
      // ablyRealtime.channels.get(`view_project_${taskContent.projectId}`).publish({ data: handleFormatDataBoard(dataTableBeforeUpdate) });

      return res.status(200).json({ status: "success", feat });
    } catch (error) {
      return res.status(400).json({
        status: "fail",
        feat,
        message: "something wrong when update task",
        error,
      });
    }
  } catch (error) {
    return res.status(401).json({ status: "fail", feat, message: "Un Authorization" });
  }
}
