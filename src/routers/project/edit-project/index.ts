import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  checkProjectExists,
  createOrSetProject,
} from "../../../lib/firebase-func";
import { ProjectType } from "../../../types";

export default async function EditProjectHandler(
  req: Request<{}, {}, ProjectType, {}>,
  res: Response
) {
  const feat = "edit project";
  const projectContent = req.body;

  if (!projectContent) {
    return res.status(404).json({
      status: "fail",
      message: "your project name is missing",
      feat,
    });
  }

  if (!(await checkEmailUIDExists(projectContent.userId))) {
    return res.status(409).json({
      status: "fail",
      error: "user doesn't exists!",
      feat,
    });
  }

  if (
    !(await checkProjectExists(projectContent.userId, projectContent.projectId))
  ) {
    return res.status(409).json({
      status: "fail",
      error: "project doesn't exists!",
      feat,
    });
  }

  try {
    await createOrSetProject(
      projectContent.userId,
      projectContent.projectId,
      projectContent
    );
    return res.status(200).json({
      status: "success",
      feat,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "something wrong!!!",
      feat,
      error,
    });
  }
}
