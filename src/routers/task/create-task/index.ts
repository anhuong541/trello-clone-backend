import { Request, Response } from "express";
import { TaskType } from "../../../types";
import {
  checkEmailUIDExists,
  checkProjectExists,
  createOrSetTask,
} from "../../../lib/firebase-func";
import { generateNewUid } from "../../../lib/utils";

export default async function CreateTaskHandler(
  req: Request<{ userId: string }, {}, TaskType, {}>,
  res: Response
) {
  const { userId } = req.params;
  const taskContent = req.body;

  if (!userId) {
    return res.status(400).json({
      status: "fail",
      message: "require userId",
      feat: "create task",
    });
  }

  if (!taskContent) {
    return res.status(400).json({
      status: "fail",
      message: "require task body",
      feat: "create task",
    });
  }

  if (!(await checkEmailUIDExists(userId))) {
    return res.status(409).json({
      status: "fail",
      error: "user doesn't exists!",
      feat: "create task",
    });
  }

  if (!(await checkProjectExists(userId, taskContent.projectId))) {
    return res.status(409).json({
      status: "fail",
      error: "project doesn't exists!",
      feat: "create task",
    });
  }

  const taskId = generateNewUid();
  const dataTask = {
    userId,
    taskId,
    ...taskContent,
  };

  try {
    const data = await createOrSetTask(
      userId,
      taskContent.projectId,
      taskId,
      dataTask
    );
    return res
      .status(200)
      .json({ status: "success", feat: "create task", data });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      feat: "create task",
      message: "something wrong when create task",
      error,
    });
  }
}
