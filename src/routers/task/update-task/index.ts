import { Request, Response } from "express";
import { TaskType } from "@/types";
import { createOrSetTask, getUpdateProjectDueTime, viewTasksProject } from "@/lib/firebase-func";
// import { io } from "@/index";

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

    try {
      await createOrSetTask(taskContent.projectId, taskContent.taskId, taskContent);
      await getUpdateProjectDueTime(taskContent.projectId);

      const dataTableAfterUpdate = await viewTasksProject(taskContent.projectId);
      console.log({ dataTableAfterUpdate });
      // io.to(taskContent.projectId).emit("view_project", dataTableAfterUpdate);

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
