import {
  checkEmailUIDExists,
  checkProjectExists,
  deteleProject,
} from "@/lib/firebase-func";
import { Request, Response } from "express";

export default async function DeleteProjectHandler(
  req: Request<{ userId: string; projectId: string }>,
  res: Response
) {
  const { userId, projectId } = req.params;
  if (!userId || !projectId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat: "delete project",
    });
  }

  if (!(await checkEmailUIDExists(userId))) {
    return res
      .status(409)
      .json({ status: "fail", error: "user doesn't exists!" });
  }

  if (!(await checkProjectExists(userId, projectId))) {
    return res
      .status(409)
      .json({ status: "fail", error: "project doesn't exists!" });
  }

  try {
    await deteleProject(userId, projectId);
    return res.status(200).json({
      status: "success",
      message: "delete project complete",
      feat: "delete project",
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: "something wrong when delete project",
      feat: "delete project",
      error,
    });
  }
}
