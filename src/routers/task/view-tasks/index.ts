import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  checkProjectExists,
  viewTasksProject,
} from "../../../lib/firebase-func";

export default async function ViewTasksHandler(
  req: Request<{ userId: string; projectId: string }>,
  res: Response
) {
  const feat = "view all tasks"; // name api
  const { userId, projectId } = req.params;
  if (!userId || !projectId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat,
    });
  }

  if (!(await checkEmailUIDExists(userId))) {
    return res.status(409).json({
      status: "fail",
      error: "user doesn't exists!",
      feat,
    });
  }

  if (!(await checkProjectExists(userId, projectId))) {
    return res.status(409).json({
      status: "fail",
      error: "project doesn't exists!",
      feat,
    });
  }

  try {
    const data = await viewTasksProject(userId, projectId);
    return res.status(200).json({ status: "success", feat, data });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      feat,
      message: "something wrong when viewing task",
      error,
    });
  }
}
