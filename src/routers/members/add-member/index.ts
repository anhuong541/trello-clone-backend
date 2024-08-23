import { addMemberAuthorityInProject, checkEmailUIDExists, checkUserAuthority } from "@/lib/firebase-func";
import { generateUidByString, readUserIdFromTheCookis } from "@/lib/utils";
import { AuthorityType } from "@/types";
import { Request, Response } from "express";

export default async function AddMemberHandler(
  req: Request<{ projectId: string }, {}, { email: string; memberAuthority: AuthorityType[] }, {}>,
  res: Response
) {
  const feat = "add member";
  const userId = readUserIdFromTheCookis(req) as string;
  const { email, memberAuthority } = req?.body;
  const projectId = req?.params?.projectId ?? "";

  if (memberAuthority.includes("Owner")) {
    return res.status(403).json({ status: "fail", feat, message: "Only creator can be the Owner" });
  }

  const memberUserId = generateUidByString(email);

  if (memberUserId === userId) {
    return res.status(409).json({
      status: "fail",
      error: "user is adding them self!",
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

    await addMemberAuthorityInProject(projectId, memberUserId, memberAuthority);
    return res.status(200).json({ status: "success", feat, message: "Add success" });
  } catch (error) {
    return res.status(400).json({ status: "fail", feat, message: "Something wrong happen to this api" });
  }
}
