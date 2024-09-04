import { checkEmailUIDExists, checkUserAuthority, removeMemberOutOfProject } from "./../../../lib/firebase-func";
import { generateUidByString, readUserIdFromTheCookis } from "./../../../lib/utils";
import { Request, Response } from "express";

export default async function DeleteMemberHandler(req: Request<{ email: string; projectId: string }>, res: Response) {
  const feat = "remove member auth";
  const userId = readUserIdFromTheCookis(req) as string;
  const { email, projectId } = req?.params;

  const memberUserId = generateUidByString(email);

  if (memberUserId === userId) {
    return res.status(409).json({
      status: "fail",
      error: "user is deleting them self!",
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

    await removeMemberOutOfProject(projectId, memberUserId);
    return res.status(200).json({ status: "success", feat, message: "Delete success" });
  } catch (error) {
    return res.status(400).json({ status: "fail", feat, message: "Something wrong happen to this api" });
  }
}
