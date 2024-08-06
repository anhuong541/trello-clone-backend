import { Request, Response } from "express";
import { deteleProject } from "../../../lib/firebase-func";

export default async function DeleteProjectHandler(
  req: Request<{ userId: string; projectId: string }>,
  res: Response
) {
  const { userId, projectId } = req.params;
  if (!userId || !projectId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat: "delete project",
    });
  }

  try {
    await deteleProject(userId, projectId);
    return res.status(200).json({
      status: "success",
      message: "delete project complete",
      feat: "delete project",
    });
  } catch (error) {}
}
