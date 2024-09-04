import { Request, Response } from "express";
import { getProjectInfo, viewMemberInProject } from "./../../../lib/firebase-func";

export default async function ProjectInfoHandler(req: Request, res: Response) {
  const feat = "project info";
  const { projectId } = req.params;

  try {
    const data = await getProjectInfo(projectId);
    const membersRes = await viewMemberInProject(projectId);

    const members = membersRes.docs.map((item) => {
      return {
        ...item.data(),
        user: item.id,
      };
    });

    return res.status(200).json({
      status: "success",
      feat,
      data: {
        ...data,
        members,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      feat,
      error,
    });
  }
}
