import { Request, Response } from "express";
import { checkUserIsAllowJoiningProject } from "./../lib/auth-action";
import { viewTasksProject } from "./../lib/firebase-func";
import { ablyRealtime } from "./../lib/socket";
import { readUserIdFromTheCookis } from "./../lib/utils";

export default async function JoinProjectRoomHandler(req: Request, res: Response) {
  const projectId = req?.params?.projectId ?? "";
  const userId = readUserIdFromTheCookis(req);
  const check = await checkUserIsAllowJoiningProject(userId, projectId);

  if (check) {
    const data = await viewTasksProject(projectId);
    await ablyRealtime.channels.get(`view_project_${projectId}`).publish({ data });
  } else {
    await ablyRealtime.channels
      .get(`view_project_${projectId}`)
      .publish({ data: { error: "User didn't allow to join this project", status: "fail" } });
  }

  return res.status(200).send({ any: "asfnaosjnfoan" });
}
