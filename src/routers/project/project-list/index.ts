import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  checkProjectExists,
  getProjectListByUser,
} from "../../../lib/firebase-func";

export default async function ProjectListHandler(
  req: Request<{ userId: string }>,
  res: Response
) {
  console.log("it run!!!");
  const { userId } = req.params;
  if (!userId) {
    return res.status(404).json({
      status: "fail",
      message: "missing userId",
      feat: "delete project",
    });
  }

  console.log("userId: ", { userId });

  if (!(await checkEmailUIDExists(userId))) {
    return res.status(409).json({
      status: "fail",
      error: "user doesn't exists!",
      feat: "Project List",
    });
  }

  try {
    const data = await getProjectListByUser(userId);
    return res.status(200).json({
      status: "success",
      message: "yeyyyy",
      feat: "Project List",
      data,
    });
  } catch (error) {
    return res.status(200).json({
      status: "fail",
      message: "something wrong!!!",
      feat: "Project List",
      error,
    });
  }
}
