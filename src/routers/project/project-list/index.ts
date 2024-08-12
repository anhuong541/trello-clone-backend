import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  getProjectListByUser,
} from "../../../lib/firebase-func";

export default async function ProjectListHandler(
  req: Request<{ userId: string }>,
  res: Response
) {
  const feat = "project list";
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId",
      feat,
    });
  }

  if (!(await checkEmailUIDExists(userId))) {
    return res.status(409).json({
      status: "fail",
      error: "user doesn't exists!",
      feat,
    });
  }

  try {
    const data = await getProjectListByUser(userId);
    return res.status(200).json({
      status: "success",
      feat,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      feat,
      error,
    });
  }
}
