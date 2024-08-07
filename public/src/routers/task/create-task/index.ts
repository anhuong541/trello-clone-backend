import { Request, Response } from "express";
import { TaskType } from "../../../types";
import {
  checkEmailUIDExists,
  checkProjectExists,
  createOrSetTask,
} from "../../../lib/firebase-func";
import { generateNewUid } from "../../../lib/utils";

export default async function CreateTaskHandler(
  req: Request<{}, {}, TaskType, {}>,
  res: Response
) {
  const feat = "create task"; // name api
  const taskContent = req.body;

  if (!taskContent) {
    return res.status(400).json({
      status: "fail",
      message: "require task body",
      feat,
    });
  }

  const taskId = generateNewUid();
  const dataTask = {
    ...taskContent,
    taskId,
  };

  try {
    await createOrSetTask(
      taskContent.userId,
      taskContent.projectId,
      taskId,
      dataTask
    );
    return res.status(200).json({ status: "success", feat });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      feat,
      message: "something wrong when create task",
      error,
    });
  }
}
