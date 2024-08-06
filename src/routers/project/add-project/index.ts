import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  createNewProject,
} from "../../../lib/firebase-func";

export default async function AddProjectHandler(req: Request, res: Response) {
  const { projectName, userId } = req.body;

  if (!projectName || !userId) {
    return res
      .status(500)
      .json({ status: "fail", message: "require project name and userId !!!" });
  }
  const dataProject = {
    projectName,
  };

  if (!(await checkEmailUIDExists(userId))) {
    return res
      .status(409)
      .json({ status: "fail", error: "userId doesn't exists!" });
  }

  await createNewProject(userId, dataProject);

  return res
    .status(200)
    .json({
      status: "success",
      message: "Create new project successfull",
      feat: "add project",
    });
}
