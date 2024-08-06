import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateUidByString, isJwtExpired } from "../../../lib/utils";
import {
  checkEmailUIDExists,
  getUserDataById,
} from "../../../lib/firebase-func";
dotenv.config();

export default async function LoginRouteHandler(req: Request, res: Response) {
  const { email, password, jwtToken } = req.body;
  if (!email || !password) {
    return res
      .status(500)
      .json({ status: "fail", message: "require email and password !!!" });
  }

  const uid = generateUidByString(email);
  const checkEmail = await checkEmailUIDExists(uid);

  if (!checkEmail) {
    return res
      .status(409)
      .json({ status: "fail", error: "email doesn't exists!" });
  }

  let token = jwtToken;

  if (!jwtToken || jwtToken === "") {
    const userJwtToken = (await getUserDataById(uid)) ?? { jwtToken: "" }; // checked user is exists
    token = userJwtToken.jwtToken;
  }

  let jwtChanged = false;

  if (await isJwtExpired(token)) {
    token = jwt.sign({ email, password }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });
    jwtChanged = true;
  }

  return res
    .status(200)
    .json({ status: "success", jwt: token, feat: "login", jwtChanged });
}
