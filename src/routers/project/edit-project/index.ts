import { Request, Response } from "express";
import { createOrSetProject } from "../../../lib/firebase-func";
import { ProjectType } from "../../../types";
import { checkUIDAndProjectExists } from "../../../lib/utils";

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

  await checkUIDAndProjectExists(
    projectContent.userId,
    projectContent.projectId,
    feat,
    res
  );

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
