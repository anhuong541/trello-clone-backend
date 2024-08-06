import { Request, Response } from "express";
import { getUserDataById } from "../../../lib/firebase-func";

export default async function TakeUserInfoHandler(req: Request, res: Response) {
  const uid = req.params.userid ?? "";
  const data = await getUserDataById(uid);
  return res
    .status(200)
    .json({ status: "success", message: "get user data success", data });
}
