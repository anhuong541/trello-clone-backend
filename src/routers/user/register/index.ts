import { Request, Response } from "express";
import { doc, setDoc } from "firebase/firestore";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { firestoreDB } from "../../../db/firebase";
import { generateUidByString } from "../../../lib/utils";
import { checkEmailUIDExists } from "../../../lib/firebase-func";
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

  await setDoc(doc(firestoreDB, "users", uid), {
    uid,
    username,
    email,
    password,
    createAt: Date.now(),
    jwtToken: token,
  });

  return res
    .status(200)
    .json({ status: "success", jwt: token, feat: "register" });
}
