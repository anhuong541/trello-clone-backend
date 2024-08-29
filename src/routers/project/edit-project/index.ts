import { Request, Response } from "express";
import { addUserProjectsInfo, checkUserAuthority, createOrSetProject } from "@/lib/firebase-func";
import { ProjectType } from "@/types";
import { checkUIDAndProjectExists, readUserIdFromTheCookis } from "@/lib/utils";

export default async function EditProjectHandler(req: Request<{}, {}, ProjectType, {}>, res: Response) {
  const feat = "edit project";
  let projectContent = req.body;

  try {
    const userId = readUserIdFromTheCookis(req) as string;

    if (!projectContent) {
      return res.status(404).json({
        status: "fail",
        message: "your project name is missing",
        feat,
      });
    }

    await checkUIDAndProjectExists(userId, projectContent.projectId, feat, res);

    let userAuthority = [];

    try {
      const dataProject = await checkUserAuthority(projectContent.projectId, userId);
      userAuthority = dataProject.authority;
    } catch (error) {
      return res.status(400).json({ status: "fail", feat, message: "Didn't find project data" });
    }

    if (!userAuthority.includes("Edit")) {
      return res.status(403).json({
        status: "fail",
        feat,
        message: "User Didn't have an authority to edit project",
      });
    }

    const dataInput = {
      ...projectContent,
      dueTime: Date.now(),
    };

    try {
      await createOrSetProject(projectContent.projectId, dataInput);
      await addUserProjectsInfo(userId, projectContent.projectId);

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
  } catch (error) {
    return res.status(401).json({ status: "fail", feat, message: "Un Authorization" });
  }
}
