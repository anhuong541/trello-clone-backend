import { Request, Response } from "express";
import {
  checkEmailUIDExists,
  getProjectListByUser,
} from "../../../lib/firebase-func";
import { generateUidByString } from "../../../lib/utils";
import config from "../../../config";
import jwt from "jsonwebtoken";

export default async function ProjectListHandler(req: Request, res: Response) {
  const feat = "project list";
  const token = req?.cookies.user_session ?? "";
  let verifedToken: any = "";

  try {
    verifedToken = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return res.status(401).json({ status: "fail", feat });
  }
  const userId = generateUidByString(verifedToken.email);

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
