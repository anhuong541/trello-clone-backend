import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { generateUidByString } from "../../../lib/utils";
import { checkEmailUIDExists } from "../../../lib/firebase-func";
import config from "../../../config";

export default async function LoginRouteHandler(req: Request, res: Response) {
  const feat = "login";
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(500).json({
      status: "fail",
      message: "require email and password !!!",
      feat,
    });
  }

  const uid = generateUidByString(email);
  const checkEmail = await checkEmailUIDExists(uid);

  if (!checkEmail) {
    return res
      .status(409)
      .json({ status: "fail", error: "email doesn't exists!", feat });
  }

  const token = jwt.sign({ email, password }, config.jwtSecret, {
    expiresIn: "30m",
  });

  res.cookie("user-session", token, {
    httpOnly: true,
    secure: config.env,
    maxAge: 60 * 60 * 24 * 2, // Two day
    path: "/",
  });

  return res.status(200).json({ status: "success", token, feat, userId: uid });
}
