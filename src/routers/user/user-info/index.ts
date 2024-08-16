import { Request, Response } from "express";
import { getUserDataById } from "../../../lib/firebase-func";
const jwt = require("jsonwebtoken");
import config from "../../../config";
import { generateUidByString } from "../../../lib/utils";

export default async function TakeUserInfoHandler(req: Request, res: Response) {
  const feat = "user-info";
  const token = req?.headers.authorization?.split(" ")[1] ?? "";
  let verifedToken: any = "";
  try {
    verifedToken = jwt.verify(token, config.jwtSecret);
  } catch (error) {
    return res.status(401).json({ status: "fail", feat });
  }
  const userId = generateUidByString(verifedToken.email);
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
