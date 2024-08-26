import { Request, Response } from "express";
import { getProjectInfo } from "@/lib/firebase-func";

export default async function ProjectInfoHandler(req: Request, res: Response) {
  const feat = "project info";
  const { projectId } = req.params;

  try {
    const data = await getProjectInfo(projectId);
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
