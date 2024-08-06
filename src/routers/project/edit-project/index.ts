import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  checkProjectExists,
  createOrSetProject,
} from "../../../lib/firebase-func";

export default async function EditProjectHandler(
  req: Request<{ projectId: string; userId: string; projectName: string }>,
  res: Response
) {
  const { userId, projectId, projectName } = req.params;
  if (!userId || !projectId || !projectName) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat: "delete project",
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

  const dataProjectEdited = {
    projectId,
    projectName,
  };

  try {
    const data = await createOrSetProject(userId, projectId, dataProjectEdited);
    return res.status(200).json({
      status: "success",
      feat: "edit project",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "something wrong!!!",
      feat: "edit project",
      error,
    });
  }
}
