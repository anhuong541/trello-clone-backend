import { viewMemberInProject } from "@/lib/firebase-func";
import { Request, Response } from "express";

export default async function ViewMemberHandler(req: Request, res: Response) {
  const feat = "view member auth";
  const projectId = req?.params?.projectId ?? "";

  try {
    const listMember = await viewMemberInProject(projectId);
    return res.status(200).json({ status: "success", feat, listMember });
  } catch (error) {
    return res.status(400).json({ status: "fail", feat, message: "Something wrong happen to this api" });
  }
}
