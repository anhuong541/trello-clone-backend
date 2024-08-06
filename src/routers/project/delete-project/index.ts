import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  checkProjectExists,
  deteleProject,
} from "../../../lib/firebase-func";

export default async function DeleteProjectHandler(
  req: Request<{ userId: string; projectId: string }>,
  res: Response
) {
  const feat = "delete project";
  const { userId, projectId } = req.params;
  if (!userId || !projectId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat,
    });
  }

  if (!(await checkEmailUIDExists(userId))) {
    return res
      .status(409)
      .json({ status: "fail", error: "user doesn't exists!", feat });
  }

  if (!(await checkProjectExists(userId, projectId))) {
    return res
      .status(409)
      .json({ status: "fail", error: "project doesn't exists!", feat });
  }

  try {
    await deteleProject(userId, projectId);
    return res.status(200).json({
      status: "success",
      message: "delete project complete",
      feat,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: "something wrong when delete project",
      feat,
      error,
    });
  }
}
