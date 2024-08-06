import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  createOrSetProject,
} from "../../../lib/firebase-func";
import { generateNewUid } from "../../../lib/utils";

export default async function AddProjectHandler(req: Request, res: Response) {
  const { projectName, userId } = req.body;

  if (!projectName || !userId) {
    return res
      .status(500)
      .json({
        status: "fail",
        message: "require project name and userId !!!",
        feat: "add project",
      });
  }

  const projectId = generateNewUid();
  const dataProject = {
    projectId,
    projectName,
  };

  if (!(await checkEmailUIDExists(userId))) {
    return res
      .status(409)
      .json({
        status: "fail",
        error: "user doesn't exists!",
        feat: "add project",
      });
  }

  try {
    await createOrSetProject(userId, projectId, dataProject);
    return res.status(200).json({
      status: "success",
      message: "Create new project successfull",
      feat: "add project",
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "something wrong when add new project",
      feat: "add project",
      error,
    });
  }
}
