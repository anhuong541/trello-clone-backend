import { Request, Response } from "express";
import { getUserDataById } from "../../../lib/firebase-func";
import { readUserIdFromTheCookis } from "../../../lib/utils";

export default async function TakeUserInfoHandler(req: Request, res: Response) {
  const feat = "user-info";
  try {
    const userId = readUserIdFromTheCookis(req, res, feat) as string;
    console.log({ userId });

    try {
      const data = await getUserDataById(userId);
      return res.status(200).json({
        status: "success",
        message: "get user data success",
        feat,
        data,
      });
    } catch (error) {
      return res.status(404).json({
        status: "fail",
        message: "missing userId or something",
        feat,
        error,
      });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ status: "fail", feat, message: "Un Authorization" });
  }
}
