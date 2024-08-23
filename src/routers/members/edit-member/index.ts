import { checkEmailUIDExists, checkUserAuthority, updateMemberAuthorityInProject } from "@/lib/firebase-func";
import { generateUidByString, readUserIdFromTheCookis } from "@/lib/utils";
import { Request, Response } from "express";

export default async function EditMemberHandler(req: Request, res: Response) {
  const feat = "edit member auth";
  const userId = readUserIdFromTheCookis(req) as string;
  const { email, memberAuthority } = req?.body;
  const projectId = req?.params?.projectId ?? "";

  if (memberAuthority.includes("Owner")) {
    return res.status(403).json({ status: "fail", feat, message: "Only project creator can be the Owner" });
  }

  const memberUserId = generateUidByString(email);

  if (memberUserId === userId) {
    return res.status(409).json({
      status: "fail",
      error: "user is editting them self!",
      feat,
    });
  }

  if (!(await checkEmailUIDExists(memberUserId))) {
    return res.status(409).json({
      status: "fail",
      error: "This member doesn't exists!",
      feat,
    });
  }

  try {
    const { authority } = await checkUserAuthority(projectId, userId);
    if (!authority.includes("Owner")) {
      return res.status(401).json({ status: "fail", feat, message: "User don't have this authority" });
    }

    await updateMemberAuthorityInProject(projectId, memberUserId, memberAuthority);
    return res.status(200).json({ status: "success", feat, message: "Edit success" });
  } catch (error) {
    return res.status(400).json({ status: "fail", feat, message: "Something wrong happen to this api" });
  }
}
