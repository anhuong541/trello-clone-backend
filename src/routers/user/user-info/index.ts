import { Request, Response } from "express";
import { getUserDataById } from "../../../lib/firebase-func";

export default async function TakeUserInfoHandler(req: Request, res: Response) {
  const feat = "user-info";
  const uid = req.params.userId ?? "";
  try {
    const data = await getUserDataById(uid);
    return res.status(200).json({
      status: "success",
      message: "get user data success",
      feat,
      data,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: "missing uid or something",
      feat,
      error,
    });
  }
}
