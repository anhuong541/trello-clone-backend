import { Request, Response } from "express";
import { readUserIdFromTheCookis } from "@/lib/utils";
import { deteleTask, getUpdateProjectDueTime } from "@/lib/firebase-func";
import { checkUserIsAllowJoiningProject } from "@/lib/auth-action";

export default async function DeleteTaskHandler(req: Request, res: Response) {
  const feat = "delete task";
  const taskContent = req.params;
  try {
    const userId = readUserIdFromTheCookis(req) as string;
    console.log("update authority: ", userId);

    if (!taskContent) {
      return res.status(400).json({
        status: "fail",
        message: "require task body",
        feat,
      });
    }

    const check = await checkUserIsAllowJoiningProject(
      userId,
      taskContent.projectId
    );

    if (!check) {
      return res.status(401).json({
        message: "User is not allow on this room",
        userAuthority: check,
        feat,
      });
    }

    try {
      await deteleTask(taskContent.projectId, taskContent.taskId);
      await getUpdateProjectDueTime(taskContent.projectId);
      return res.status(200).json({ status: "success", feat });
    } catch (error) {
      return res.status(400).json({
        status: "fail",
        feat,
        message: "something wrong when delete task",
        error,
      });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: "fail", feat, message: "Un Authorization" });
  }
}
