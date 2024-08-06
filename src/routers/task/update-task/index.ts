import { Request, Response } from "express";
import { TaskType } from "../../../types";
import { createOrSetTask } from "../../../lib/firebase-func";

export default async function UpdateTaskHandler(
  req: Request<{}, {}, TaskType, {}>,
  res: Response
) {
  const feat = "update task";
  const taskContent = req.body;

  if (!taskContent) {
    return res.status(400).json({
      status: "fail",
      message: "require task body",
      feat,
    });
  }

  try {
    const data = await createOrSetTask(
      taskContent.userId,
      taskContent.projectId,
      taskContent.taskId,
      taskContent
    );
    return res.status(200).json({ status: "success", feat, data });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      feat,
      message: "something wrong when update task",
      error,
    });
  }
}
