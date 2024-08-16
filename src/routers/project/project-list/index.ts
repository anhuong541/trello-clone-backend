import { Request, Response } from "express";
import { getProjectListByUser } from "../../../lib/firebase-func";
import { readUserIdFromTheCookis } from "../../../lib/utils";

export default async function ProjectListHandler(req: Request, res: Response) {
  const feat = "project list";
  const userId = readUserIdFromTheCookis(req, res, feat) as string;

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
