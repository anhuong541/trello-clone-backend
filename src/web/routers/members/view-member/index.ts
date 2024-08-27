import { getUserDataById, viewMemberInProject } from "@/lib/firebase-func";
import { DocumentData } from "firebase/firestore";
import { Request, Response } from "express";

export default async function ViewMemberHandler(req: Request, res: Response) {
  const feat = "view member auth";
  const projectId = req?.params?.projectId ?? "";
  let listMembers: any;
  let data = [];

  try {
    listMembers = await viewMemberInProject(projectId);
  } catch (error) {
    return res.status(400).json({ status: "fail", feat, message: "Something wrong happen when access project list members" });
  }

  try {
    await Promise.all(
      listMembers.docs.map(async (item: DocumentData) => {
        const res = await getUserDataById(item.id);
        const dataItem = item.data();
        return {
          ...res,
          ...dataItem,
        };
      })
    ).then((value) => (data = value));
  } catch (error) {
    return res.status(404).json({ status: "fail", feat, message: "something got wrong when getting list user" });
  }

  return res.status(200).json({
    status: "success",
    feat,
    listUser: data,
  });
}
