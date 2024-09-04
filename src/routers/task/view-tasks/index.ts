import { Request, Response } from "express";
import { checkProjectExists, viewTasksProject } from "./../../../lib/firebase-func";
import { readUserIdFromTheCookis } from "./../../../lib/utils";
import { checkUserIsAllowJoiningProject } from "./../../../lib/auth-action";

export default async function ViewTasksHandler(req: Request<{ projectId: string }>, res: Response) {
  const feat = "view all tasks"; // name api
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

    if (!(await checkProjectExists(projectId))) {
      return res.status(409).json({ status: "fail", error: "project doesn't exists!", feat });
    }

    const check = await checkUserIsAllowJoiningProject(userId, projectId);

    if (!check) {
      return res.status(401).json({
        message: "User is not allow on this room",
        userAuthority: check,
        feat,
      });
    }

    try {
      const data = await viewTasksProject(projectId);

      return res.status(200).json({ status: "success", feat, data });
    } catch (error) {
      return res.status(400).json({
        status: "fail",
        feat,
        message: "something wrong when viewing task",
        error,
      });
    }
  } catch (error) {
    return res.status(401).json({ status: "fail", feat, message: "Un Authorization" });
  }
}
