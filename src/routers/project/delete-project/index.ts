import { Request, Response } from "express";
import { deteleProject } from "../../../lib/firebase-func";
import {
  checkUIDAndProjectExists,
  generateUidByString,
} from "../../../lib/utils";
import config from "../../../config";
import jwt from "jsonwebtoken";

export default async function DeleteProjectHandler(
  req: Request<{ projectId: string }>,
  res: Response
) {
  const feat = "delete project";
  const { projectId } = req.params;
  if (!projectId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId or projectId",
      feat,
    });
  }

  const token = req?.cookies.user_session ?? "";
  let verifedToken: any = "";
  try {
    verifedToken = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return res.status(401).json({ status: "fail", feat });
  }
  const userId = generateUidByString(verifedToken.email);

  await checkUIDAndProjectExists(userId, projectId, feat, res);

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
}
