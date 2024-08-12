import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateUidByString } from "../../../lib/utils";
import { checkEmailUIDExists, createNewUser } from "../../../lib/firebase-func";
import config from "../../../config";
import { sendUserSession } from "../../../lib/auth-action";

export default async function RegisterRouteHandler(
  req: Request,
  res: Response
) {
  const feat = "register";
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
      .json({ status: "fail", error: "email have been used!", feat });
  }

  const token = jwt.sign({ email, password }, config.jwtSecret, {
    expiresIn: "1h",
  });

  const dataRegister = {
    uid,
    username,
    email,
    password,
    createAt: Date.now(),
  };

  sendUserSession(res, token);

  try {
    await createNewUser(uid, dataRegister);
    return res.status(200).json({ status: "success", feat });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: "something wrong when register new user",
      feat,
      error,
    });
  }
}
