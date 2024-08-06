import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateUidByString } from "../../../lib/utils";
import { checkEmailUIDExists, createNewUser } from "../../../lib/firebase-func";
dotenv.config();

export default async function RegisterRouteHandler(
  req: Request,
  res: Response
) {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    res.status(500);
    throw Error("require email and password !!!");
  }

  const uid = generateUidByString(email);
  const checkEmail = await checkEmailUIDExists(uid);

  if (checkEmail) {
    return res
      .status(409)
      .json({ status: "fail", error: "email have been used!" });
  }

  const token = jwt.sign({ email, password }, process.env.JWT_SECRET!, {
    expiresIn: "30m",
  });

  const dataRegister = {
    uid,
    username,
    email,
    password,
    createAt: Date.now(),
    jwtToken: token,
  };

  try {
    await createNewUser(uid, dataRegister);
    return res
      .status(200)
      .json({ status: "success", jwt: token, feat: "register" });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "something wrong when register new user",
      feat: "register",
      error,
    });
  }
}
