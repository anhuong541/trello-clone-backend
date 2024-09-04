import { Request, Response } from "express";
import { checkUserAuthority, deteleProject } from "./../../../lib/firebase-func";
import { checkUIDAndProjectExists, readUserIdFromTheCookis } from "./../../../lib/utils";

export default async function DeleteProjectHandler(req: Request<{ projectId: string }>, res: Response) {
  const feat = "delete project";
  try {
    const userId = readUserIdFromTheCookis(req) as string;
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(404).json({
        status: "fail",
        message: "missing userId or projectId",
        feat,
      });
    }

    await checkUIDAndProjectExists(userId, projectId, feat, res);

    let userAuthority = [];

    try {
      const dataProject = await checkUserAuthority(projectId, userId);
      userAuthority = dataProject.authority;
    } catch (error) {
      return res.status(400).json({ status: "fail", feat, message: "Didn't find project data" });
    }

    if (!userAuthority.includes("Owner")) {
      return res.status(403).json({
        status: "fail",
        feat,
        message: "User Didn't have an authority to delete project",
      });
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
  } catch (error) {
    return res.status(401).json({ status: "fail", feat, message: "Un Authorization" });
  }
}
