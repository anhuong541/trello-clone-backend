import { Request, Response } from "express";

import { getUserDataById } from "./../../../lib/firebase-func";
import { readUserIdFromAuth } from "./../../../lib/utils";

export default async function TakeUserInfoHandler(req: Request, res: Response) {
  const feat = "user-info";
  let userId = "";

  try {
    userId = readUserIdFromAuth(req);
  } catch (error) {
    console.log("error: ", error);
    return res.status(400).json({ feat, status: "fail", message: "it got error from here!!!" });
  }

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
}
