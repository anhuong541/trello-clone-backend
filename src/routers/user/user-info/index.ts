// import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { getUserDataById } from "@/lib/firebase-func";
import { readUserIdFromTheCookis } from "@/lib/utils";
// import config from "@/config";

export default async function TakeUserInfoHandler(req: Request, res: Response) {
  const feat = "user-info";
  const userId = readUserIdFromTheCookis(req); // send at the server

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
