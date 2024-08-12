import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { generateUidByString } from "../../../lib/utils";
import { checkEmailUIDExists, createNewUser } from "../../../lib/firebase-func";
import config from "../../../config";

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
    expiresIn: "30m",
  });

  const dataRegister = {
    uid,
    username,
    email,
    password,
    createAt: Date.now(),
  };

  res.cookie("user-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // One day
    path: "/",
  });

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
