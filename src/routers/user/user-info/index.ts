import { getUserDataById } from "@/lib/firebase-func";
import { Request, Response } from "express";

export default async function TakeUserInfoHandler(req: Request, res: Response) {
  const uid = req.params.userid ?? "";
  try {
    const data = await getUserDataById(uid);
    return res.status(200).json({
      status: "success",
      message: "get user data success",
      feat: "user-info",
      data,
    });
  } catch (error) {
    return res.status(404).json({
      status: "fail",
      message: "missing uid or something",
      feat: "user-info",
      error,
    });
  }
}
