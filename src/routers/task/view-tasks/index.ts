import { Request, Response } from "express";
import {
  checkProjectExists,
  viewTasksProject,
} from "../../../lib/firebase-func";
import { generateUidByString } from "../../../lib/utils";
import config from "../../../config";
import jwt from "jsonwebtoken";

export default async function ViewTasksHandler(
  req: Request<{ userId: string; projectId: string }>,
  res: Response
) {
  const feat = "view all tasks"; // name api
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

  if (!(await checkProjectExists(userId, projectId))) {
    return res
      .status(409)
      .json({ status: "fail", error: "project doesn't exists!", feat });
  }

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
