import { Request, Response } from "express";
import { viewTasksProject } from "../../../lib/firebase-func";
import { checkUIDAndProjectExists } from "../../../lib/utils";

export default async function ViewTasksHandler(
  req: Request<{ userId: string; projectId: string }>,
  res: Response
) {
  const feat = "view all tasks"; // name api
  const { userId, projectId } = req.params;
  if (!userId || !projectId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat,
    });
  }

  await checkUIDAndProjectExists(userId, projectId, feat, res);

  try {
    const data = await viewTasksProject(userId, projectId);
    return res.status(200).json({ status: "success", feat, data });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      feat,
      message: "something wrong when viewing task",
      error,
    });
  }
}
