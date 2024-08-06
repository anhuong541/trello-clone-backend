import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  createOrSetProject,
} from "../../../lib/firebase-func";
import { generateNewUid } from "../../../lib/utils";
import { ProjectType } from "../../../types";

export default async function AddProjectHandler(
  req: Request<{}, {}, ProjectType, {}>,
  res: Response
) {
  const feat = "add project";
  const projectContent = req.body;

  if (!projectContent) {
    return res.status(500).json({
      status: "fail",
      message: "require project name and userId !!!",
      feat,
    });
  }

  const projectId = generateNewUid();
  const dataProject = {
    ...projectContent,
    projectId,
  };

  if (!(await checkEmailUIDExists(projectContent.userId))) {
    return res.status(409).json({
      status: "fail",
      error: "user doesn't exists!",
      feat,
    });
  }

  try {
    await createOrSetProject(projectContent.userId, projectId, dataProject);
    return res.status(200).json({
      status: "success",
      message: "Create new project successfull",
      feat,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "something wrong when add new project",
      feat,
      error,
    });
  }
}
