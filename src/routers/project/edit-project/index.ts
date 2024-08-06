import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  checkProjectExists,
  createOrSetProject,
} from "../../../lib/firebase-func";
import { ProjectType } from "../../../types";

export default async function EditProjectHandler(
  req: Request<
    { projectId: string; userId: string },
    {},
    { projectContent: ProjectType },
    {}
  >,
  res: Response
) {
  const { projectContent } = req.body;
  const { userId, projectId } = req.params;
  if (!userId || !projectId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat: "edit project",
    });
  }

  if (!projectContent) {
    return res.status(404).json({
      status: "fail",
      message: "your project name is missing",
      feat: "edit project",
    });
  }

  if (!(await checkEmailUIDExists(userId))) {
    return res.status(409).json({
      status: "fail",
      error: "user doesn't exists!",
      feat: "edit project",
    });
  }

  if (!(await checkProjectExists(userId, projectId))) {
    return res.status(409).json({
      status: "fail",
      error: "project doesn't exists!",
      feat: "edit project",
    });
  }

  const dataProjectEdited = {
    projectId,
    ...projectContent,
  };

  try {
    await createOrSetProject(userId, projectId, dataProjectEdited);
    return res.status(200).json({
      status: "success",
      feat: "edit project",
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
