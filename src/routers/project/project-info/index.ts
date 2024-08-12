import { Request, Response } from "express";
import { getProjectInfo } from "../../../lib/firebase-func";
import { checkUIDAndProjectExists } from "../../../lib/utils";

export default async function ProjectInfoHandler(
  req: Request<{ projectId: string; userId: string }>,
  res: Response
) {
  const feat = "project info";
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
    const data = await getProjectInfo(userId, projectId);
    return res.status(200).json({
      status: "success",
      feat,
      data,
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
