import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  checkProjectExists,
  getProjectInfo,
} from "../../../lib/firebase-func";

export default async function ProjectInfoHandler(
  req: Request<{ projectId: string; userId: string }>,
  res: Response
) {
  const { userId, projectId } = req.params;
  if (!userId || !projectId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat: "project info",
    });
  }

  if (!(await checkEmailUIDExists(userId))) {
    return res.status(409).json({
      status: "fail",
      error: "user doesn't exists!",
      feat: "project info",
    });
  }

  if (!(await checkProjectExists(userId, projectId))) {
    return res.status(409).json({
      status: "fail",
      error: "project doesn't exists!",
      feat: "project info",
    });
  }

  try {
    const data = await getProjectInfo(userId, projectId);
    return res.status(200).json({
      status: "success",
      feat: "project info",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "something wrong!!!",
      feat: "project info",
      error,
    });
  }
}
