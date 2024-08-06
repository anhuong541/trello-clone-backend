import { Request, Response } from "express";
import { generateUidByString, isJwtExpired } from "../../lib/utils";
import { checkEmailUIDExists } from "../../lib/firebase-func";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { doc, getDoc } from "firebase/firestore";
import { firestoreDB } from "../../db/firebase";
dotenv.config();

export default async function LoginRouteHandler(req: Request, res: Response) {
  const { email, password, jwtToken } = req.body;
  if (!email && !password) {
    res.status(500);
    throw Error("require email and password !!!");
  }

  const uid = generateUidByString(email);
  const checkEmail = await checkEmailUIDExists(uid);

  if (!checkEmail) {
    return res.status(409).json({ status: "fail", error: "email existed!" });
  }

  let token = jwtToken;

  if (!jwtToken || jwtToken === "") {
    const userJwtToken = (
      await getDoc(doc(firestoreDB, `users`, uid))
    ).data() ?? { jwtToken: "" }; // checked user is exists

    console.log("it runn!!!");

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
